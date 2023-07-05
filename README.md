# Reward Timer

A simple app for tracking points earned for completing tasks and associated rewards. Also tracks point deductions for being off task. A timer API allows for both daily and one-off timers. This application is intended to be self hosted. 

---

## Installation (docker)

The application is served over SSL. The following commands will create self signed SSL certificates, and build the required components of the application. If you make any changes to the code, you will need to run the build script again to deploy the production version. 

```
./scripts/create_ssl_keys.sh
./docker/build.sh
```

To run the application:

```
./docker/run.sh
```

If you want to make any changes to the port that this application is hosted on, you can modify the `run.sh` file.



