FROM sc5io/ubuntu:14.04
ENV PORT 8080
EXPOSE 8080
ENV PATH ./node_modules/gulp/bin:$PATH
ENV NODE_ENV development

# Install apps and dependencies
# NOTE: These steps depends highly on service in question
RUN apt-get update
RUN apt-get install -y git vim

WORKDIR /app
RUN useradd -m -d /app app
RUN mkdir -p /app/.ssh /app/.npm
RUN chmod 700 /app/.ssh ; chown -R app.app /app
RUN echo "alias ll='ls -l'" >> /app/.bashrc
COPY deploy/ssh/* /app/.ssh/
RUN chmod 700 /app/.ssh/* ; chown -R app.app /app/.ssh
RUN chown -R app.app /usr/lib/node_modules/npm/
ADD package.json /app/package.json

# Install dependencies and app
USER app
ENV HOME /app
RUN npm install
ADD . /app
RUN npm run build

USER root
RUN chown -R app.app /app
USER app

# Default command to run service
ENV NODE_ENV production
CMD npm start