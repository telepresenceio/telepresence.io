---
title: telepresence compose commit
description: Create a new image from a service container's changes
hide_table_of_contents: true
---

Create a new image from a service container's changes

### Usage:
```
  telepresence compose commit [flags] [services]
```

### Flags:
```
  -h, --help   help for commit
```

### Compose flags:
```
      --env-file stringArray       Optional environment files
  -f, --file stringArray           Compose configuration files
      --profile stringArray        Profile to enable
      --project-directory string   Specify an alternate working directory (default: the path of the, first specified, Compose file)
      --project-name string        Project name
```

### Compose commit flags:
```
  -a, --author string    Author (e.g., "John Hannibal Smith
  -c, --change list      Apply Dockerfile instruction to the created image
      --index int        index of the container if service has multiple
  -m, --message string   Commit message
  -p, --pause            Pause container during commit (default true)
```

### Global Flags:
```
      --output string     Set the output format, supported values are 'json', 'yaml', and 'default' (default "default")
      --progress string   Set type of progress output (auto, tty, plain, json, quiet) (default "auto")
      --use string        Match expression that uniquely identifies the daemon container
```
