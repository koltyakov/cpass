
## Test with Docker

### In project root folder

Go to `cpass` root folder, not `./docker`

### Build image

```bash
docker build -f ./docker/Dockerfile.node8 -t cpass.node8 .
```

### Run container && Tests

```bash
docker run cpass.node8
```

## Misc

### Lists containers

```bash
docker ps
```

### Lists images

```bash
docker images
```

### Delete image

```bash
docker rmi 8ef72
```

(first image guid symbols)