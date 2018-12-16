# Final CDX Monitor
Monitors services for Professor Franco's Final CDX assignment

## Usage

This application monitors all the services required for the final assignment in Professor Franco's Cyber Defense class. It pings each service every minute, verifying that it is up. This data is then logged to a MySQL database. If any service goes up or down, an email is sent to a specified list of addresses (most likely, your team). It also includes a web console that shows the status of each service.

The services supported are the web server, the WordPress site, the MySQL database, the printer service, ICMP pinging, the FTP server, and the daytime service.

## Web console

Going to the monitor's IP in your web browser, you can see the status of each service on each IP that's being monitored. It will ask you for credentials that you can specify in order to prevent denial of service attacks.

## Setup

1. Pull this repository
2. Set up a MySQL database and create a schema called `final-cdx-monitor`.
3. Configure a Google account to run an SMTP server. It is recommended that you make a new one just for this project.
   1. Go to Gmail > Settings (from the dropdown from the gear icon in the top-right corner) > Forwarding and POP/IMAP > Enable IMAP
   2. Go to your account settings > Sign-In & Security > Turn `Allow less secure apps` on.
4. Install [npm](https://www.npmjs.com/get-npm) if you do not have it already.
5. Go to the root folder of this repository and run the console command `npm install`.
6. Run the application with the command `npm run start`. 

In order for the application to work properly, these environment variables need to be passed to the application:

```
IPS_TO_MONITOR: a comma-separated list of all the IPs for each virtual machine you want to monitor.
PORT: the port for the web console. Should be 80.
RDS_HOSTNAME: the host for the logging database.
RDS_PORT: the port for the logging database.
RDS_USERNAME: the username for the logging database.
RDS_PASSWORD: the password for the logging database.
EMAIL_SERVER_USERNAME: the username for the Google account used for the email alerts.
EMAIL_SERVER_PASSWORD: the password for the Google account used for the email alerts.
EMAIL_RECIPIENTS: a comma-separated list of all the email addresses to send alerts to.
WEBSERVER_USERNAME: the username for the web console.
WEBSERVER_PASSWORD: the password for the web console.
```

This can be done by using this format when running the start command:
```
VAR1=<val> VAR2=<val> VAR3=<val> ... npm run start
```

## Verify individual services

You can also test individual services using the command
```
IP=<ip> MONITOR=<daytime | ftp | icmp | ipp | mysql | website | wordpress> npm run test
```
This will ping a single service on a single ip once. You can use this to verify that the system is working properly and that the proper ports and such are open for the monitor.
