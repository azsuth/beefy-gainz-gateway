kubectl apply -f k8s.yml
kubectl set image deployments/gateway-deployment gateway=azsuth/beefy-gainz-gateway:$SHA