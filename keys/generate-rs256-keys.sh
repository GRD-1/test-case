#!/bin/bash

PRIVATE_KEY="keys/private.pem"
PUBLIC_KEY="keys/public.pem"

openssl genpkey -algorithm RSA -out $PRIVATE_KEY -pkeyopt rsa_keygen_bits:2048

openssl rsa -pubout -in $PRIVATE_KEY -out $PUBLIC_KEY

echo "RS256 key pair generated successfully!"
echo "Private Key: $PRIVATE_KEY"
echo "Public Key: $PUBLIC_KEY"
