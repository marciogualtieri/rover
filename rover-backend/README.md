<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Rover.com Back-end](#rovercom-back-end)
  - [Overview](#overview)
  - [TODO's](#todos)
  - [Installing Dependencies](#installing-dependencies)
  - [Database Models](#database-models)
  - [Running Tests](#running-tests)
  - [Running the App](#running-the-app)
  - [Recovering the Data](#recovering-the-data)
  - [Developer's Guide](#developers-guide)
    - [Resetting Migrations](#resetting-migrations)
    - [Generating Model Diagrams](#generating-model-diagrams)
  - [Creating a Super User](#creating-a-super-user)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Rover.com Back-end

## Overview

The requirements are described in more detail [here](../specification/README.md).

We have developed a MVP based on the circumstances in the requirements and time constrains (about 3 days for development).

Specifically, thinking about the existent users, we should support the following test case:

- User tries to login and fail (due to the data crash).
- User resets password.
- User finally logs-in.
- User list rankings.

To have complete core functionality though, the users should also be able to:

- Sign-up.
- Submit reviews for stays.

Due to the time constraints, submitting reviews are out of the scope of this project (at least the front end,
the back-end does support it, due to using `ModelViews`, but it hasn't been tested).

The back-end also supports deleting and updating reviews, even though (due to the time constrains once again).
they have not been tested (they are not being used by the front-end at the moment).

The back-end supports token authorization using [django-rest-auth](https://github.com/Tivix/django-rest-auth), which 
means that only registered users can access the back-end by providing a header token.

The back-end also contains scripts to recover the database. Please refer to [Recovering the Data](#recovering-the-data) for more details, including
instructions.

## TODO's

- More unit tests, particularly for delete and update stays.
- Creating views for updating user information.
- Adding tests for the Django Admin interface for managing users (even though at the moment they are for development use only).
- Adding tests for authentication (even though authentication only required configuration, better be safe than sorry).


Probably in this order. More automated tests (particularly end-to-end) before adding more features makes more sense in my opinion.

## Installing Dependencies

You will need Python 3, and Docker to run this project.

You may want to use Python Virtual Environment and create your own virtual environment first:

```
python3 -m venv .env
source .env/bin/activate
```

Execute the following command to install the requirements:

```
pip install -r requirements.txt
```

Also install the development requirements, if you wish to develop and run tests:

```
pip install -r dev-requirements.txt
```

## Database Models

![Database Models](./images/models.png)

Note that I have decided to extend Django's existent `User` model, creating our own `CustomUser`.

The customisation consists of using email instead of username (Django's default) and adding additional fields
required by the specification.

This design also allows us straightforward use of `django-rest-auth`, which allows login, and logout by itself,
and together with [django-allauth](https://github.com/pennersr/django-allauth), allows us password reset and
registration with email confirmation.

I felt like authentication and account recovery were paramount given the circumstances described in the specification.

Refer to the [rover-frontend](../rover-frontend) for a demonstration of how password reset and registration work.

## Running Tests

```
pytest --log-cli-level=DEBUG
```
This will run tests in debug mode, if you wish, you may change the log level or omit it altogether.

>**NOTE:** Authentication has been disabled in tests.

## Running the App

- Start a docker container as follows:

```
docker run --name rover -e POSTGRES_PASSWORD=postgres -d -p 5432:5432 postgres
```

The command will start a Postgres database running on localhost:5432 with credentials postgres/postgres.

- Create a development database:

Initiate a bash session with the container:

```
docker exec -it rover bash
```

In the container, you may connect to postgres:

```
su postgres
psql
```

Create the database:

```
CREATE DATABASE ROVER;
```

- Run migrations:

```
./manage.py migrate
```

- Import the development data dump:

```
./manage.py loaddata dumps/data.json
```

If you prefer to go through the procedure for recovering the database from the CVS data instead, refer to [this section](#recovering-the-data).

- Start the back-end:

```
./manage.py runserver
```

You should now be able to send requests:

```
curl -s -XPOST -H "Content-Type: application/json" -d '{
    "email": "user5021@hotmail.com",
    "password": "qed28292829"
}' http://127.0.0.1:8000/rest-auth/login/ | jq '.'
{
  "key": "11312da5eafedf3d84bee57cb887e49ee8e93ee3"
}
```
This requests gets a token.

```
curl -s -H "Authorization: Token 11312da5eafedf3d84bee57cb887e49ee8e93ee3" http://127.0.0.1:8000/reviews/v1/scores/ | jq '.'
{
  "count": 100,
  "next": null,
  "previous": null,
  "results": [
    {
      "sitter": {
        "id": 158,
        "email": "user7903@hotmail.com",
        "name": "Faridah D.",
        "phone": "+11633847457",
        "image": "https://images.dog.ceo/breeds/shihtzu/n02086240_12480.jpg"
      },
      "ratings": 4.6,
      "overall": 4.0256410256410255
    },
    {
      "sitter": {
        "id": 137,
        "email": "user9029@t-mobile.com",
        "name": "Melissa C.",
        "phone": "+14983477354",
        "image": "https://images.dog.ceo/breeds/wolfhound-irish/n02090721_537.jpg"
      },
      "ratings": 4,
      "overall": 3.620879120879121
    },
    ...
}
```
This request gets scores (ordered by overall ratings).
Note that we have pagination enabled. You may also pass your own page size in the request:

```
curl -s -H "Authorization: Token 11312da5eafedf3d84bee57cb887e49ee8e93ee3" http://127.0.0.1:8000/reviews/v1/scores/?limit=1 | jq '.'
{
  "count": 100,
  "next": "http://127.0.0.1:8000/reviews/v1/scores/?limit=1&offset=1",
  "previous": null,
  "results": [
    {
      "sitter": {
        "id": 158,
        "email": "user7903@hotmail.com",
        "name": "Faridah D.",
        "phone": "+11633847457",
        "image": "https://images.dog.ceo/breeds/shihtzu/n02086240_12480.jpg"
      },
      "ratings": 4.6,
      "overall": 4.0256410256410255
    }
  ]
}
```

## Recovering the Data

Even though this solution applies only to a specific database (Postgres in this case), I felt that this was the
simples and best performing solution.

Recovering the database by running SQL statements will give us the best performance and it will scale with the
volume of data. Also, this script only needs to be run once (assuming that the probably of such disaster ever
happening again is low).

- Follow the instructions in [Running the App](#running-the-app) to run a development database using docker.

- Copy the data to your docker container:

```
docker cp ~/magnitude-innovations/specification/reviews.csv rover:/tmp/
```

- Copy the database recovery script to the container:

```
docker cp ~/magnitude-innovations/rover-backend/scripts/recover.sql rover:/tmp/
```

Initiate a bash session with the docker container:

```
docker exec -it rover bash
```

Once in the container, you may connect to postgres:

```
su postgres
psql rover
```

- Execute the recovery script:

```
psql -d rover -a -f /tmp/recovery.sql
```

In your own local environment, outside the container, you may now save a snapshot of the database to a file
if you wish:

```
./manage.py dumpdata --indent 4 > dumps/data.json
```

This way you don't need to go through the data recovery all over again to set your development environment.

## Developer's Guide

### Resetting Migrations

If you changed your models and you wish to start from scratch:

```
rm -rf ./reviews/migrations ./users/migrations
./manage.py makemigrations reviews users
./manage.py migrate
```

If you change the models and want only to run tests, run the following command to update the migrations:

```
DJANGO_SETTINGS_MODULE=tests.settings ./manage.py makemigrations
```

You don't need a running development database to update the migrations.

### Generating Model Diagrams

You will need to install graphviz on you OS. Here's how to install it on Ubuntu:

```
 sudo apt install graphviz graphviz-dev
```

Generate "users" and "reviews" models:

```
./manage.py graph_models users reviews -o images/models.png
```

Generate all models (including Django's internals):

```
./manage.py graph_models -a -g -o images/models_all.png
```

## Creating a Super User

```
./manage.py createsuperuser
```

You may use this user to login to `/admin` for debugging purposes.
