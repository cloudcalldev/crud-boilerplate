FROM node:latest-alpine
LABEL maintainer="CloudCall Development <development@cloudcall.com>"
ENV REFRESHED_AT 2019-03-28

###############################################################################
#                                INSTALLATION
###############################################################################

# Install Node 8 (as this the latest AWS Lambda node runtime)
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install -y nodejs zip build-essential

###############################################################################
#                               CONFIGURATION
###############################################################################

WORKDIR /usr/src/app

COPY ./ ./

RUN ["npm", "install"]
RUN ["npm", "run", "build"]
RUN ["npm", "test"]
RUN ["npm", "prune", "--production"]

###############################################################################
#               Build zip, to be used when creating a lambda (optional: this can be commented out when building a docker container)
###############################################################################

RUN mkdir  /app_zipped
RUN zip -r /app_zipped/build.zip *

###############################################################################
#               Set entry point, to be used when creating a docker container (optional: this can be commented out when building a lambda)
###############################################################################

CMD [ "npm", "start" ]
