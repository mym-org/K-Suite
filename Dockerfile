FROM openjdk:8-jre-alpine
ADD build/libs/*.jar ksuite-1.0.0.jar
VOLUME /tmp
ENV JAVA_OPTS="-server -Xms4096m -Xmx4096m -XX:+UseG1GC -Dfile.encoding=UTF-8 -Djava.net.preferIPv4Stack=true -Dsun.net.inetaddr.ttl=10 -Djava.security.egd=file:/dev/./urandom"
ENTRYPOINT exec java $JAVA_OPTS -jar /ksuite-1.0.0.jar