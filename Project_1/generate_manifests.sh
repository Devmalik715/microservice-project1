#!/bin/bash

# Directory containing services
services=("order-service" "payment-service" "product-service" "ui-service" "user-service")

# Namespace for Kubernetes (optional)
namespace="project1"

# Iterate over services
for service in "${services[@]}"; do
  # Generate deployment.yaml
  cat <<EOF > $service-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: $service
  namespace: $namespace
spec:
  replicas: 2
  selector:
    matchLabels:
      app: $service
  template:
    metadata:
      labels:
        app: $service
    spec:
      containers:
      - name: $service
        image: devmalik715/$service:latest
        ports:
        - containerPort: 3000
EOF

  # Generate service.yaml
  cat <<EOF > $service-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: $service
  namespace: $namespace
spec:
  selector:
    app: $service
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: ClusterIP
EOF

done

echo "Manifests generated for all services."
