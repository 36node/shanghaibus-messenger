#!/bin/sh

export CPPFLAGS=-I/usr/local/opt/openssl/include
export LDFLAGS=-L/usr/local/opt/openssl/lib

echo "CPPFLAGS: $CPPFLAGS"
echo "LDFLAGS: $LDFLAGS"