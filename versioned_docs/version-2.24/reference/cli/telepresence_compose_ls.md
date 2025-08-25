---
title: telepresence compose ls
description: List running compose projects
hide_table_of_contents: true
---

List running compose projects

### Usage:
```
  telepresence compose ls [flags] [services]
```

### Flags:
```
  -h, --help   help for ls
```

### Compose flags:
```
      --env-file stringArray       Optional environment files
  -f, --file stringArray           Compose configuration files
      --profile stringArray        Profile to enable
      --project-directory string   Specify an alternate working directory (default: the path of the, first specified, Compose file)
      --project-name string        Project name
```

### Compose ls flags:
```
  -a, --all             Show all stopped Compose projects
      --filter string   Filter output based on conditions provided
      --format string   Format the output. Values: [table | json]
  -q, --quiet           Only display project names
```

### Global Flags:
```
      --output string     Set the output format, supported values are 'json', 'yaml', and 'default' (default "default")
      --progress string   Set type of progress output (auto, tty, plain, json, quiet) (default "auto")
      --use string        Match expression that uniquely identifies the daemon container
```
