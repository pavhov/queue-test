Init case

    1. run `./init.sh` script for install node_modules create local env variables and build services

Services

    1. *initial-jobs*
        1. Create mysql tables 
        2. Insert 100.000 test users on user table 
    2. *users-service*
        1. Create 3 CRUD-s (users, emails, jobs)
    3. *queue-service*
        1. Create 1 story in this story I have one email task for get send email jobs and _(send email)_

Test steps

    1. You will run *initial-jobs* service `yarn start` *note* service will stop after last case "**insert users succeeded**"
    2. You will run *users-service* service `yarn start` *note* service will 
        1. open http connection for rest requests 
        2. open kafka connection send job commands
    3. Yu will run *queue-service* service `yarn start` *note* service will create kafka listener and listen **jobs** topic messages for run *(email send)* job
    4. Import *postman_collection.json*  on your postman and open *user-test -> job -> create* request and send request
    5. You can get job status on *user-test -> job -> list* request
