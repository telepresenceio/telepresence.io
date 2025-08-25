---
title: telepresence compose port
description: Print the public port for a port binding
hide_table_of_contents: true
---

Print the public port for a port binding

### Usage:
```
  telepresence compose port [flags] [services]
```

### Flags:
```
  -h, --help   help for port
```

### Compose flags:
```
      --env-file stringArray       Optional environment files
  -f, --file stringArray           Compose configuration files
      --profile stringArray        Profile to enable
      --project-directory string   Specify an alternate working directory (default: the path of the, first specified, Compose file)
      --project-name string        Project name
```

### Compose port flags:
```
      --index int         Index of the container if service has multiple
      --protocol string   tcp or udp (default "\"tcp\"")
```

### Global Flags:
```
      --output string     Set the output format, supported values are 'json', 'yaml', and 'default' (default "default")
      --progress string   Set type of progress output (auto, tty, plain, json, quiet) (default "auto")
      --use string        Match expression that uniquely identifies the daemon container
```
