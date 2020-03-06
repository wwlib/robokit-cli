### robokit-cli

A command line tool (REPL) for controlling robokit robots.

#### installation and building

```
npm install
npm run build
```

#### running

`npm run start`

#### installing globally (for development)
```
npm install -g git+ssh://git@github.com:wwlib/robokit-cli.git

robokit-cli
help

or

robokit-cli --command help

```

#### repl commands

`robokit-cli --command help`

```
$ <shell command>:               executes the specified shell command
! <rom command>:                 sends the specified rom commmand to targeted robot(s)
load profile <path>:             loads the specified profile json
show profile <profileId>:        shows the specified profile
show robot <configId>:           shows the specified robot config
delete profile <id>:             deletes the specified profile json (must save)
edit profile <property> <value>: edit a profile property (must save)
edit robot <property> <value>:   edit a robot config property (must save)
new profile:                     create a new profile (must save)
new robot:                       create a new robot config (must save)
save config:                     saves the loaded profiles and robot configs
[list] profiles:                 lists the loaded profiles
[list] robots:                   lists the loaded robot configs
commands:                        lists the defined rom commands
[set] profile <id>:              sets the active profile
[set] robot <id>:                sets the active robot config
connect:                         connects the targeted robot(s)
disconnect:                      disconnects the targeted robot(s)
start <skill>:                   starts the specified skill
say <text>:                      sends a tts rom command with the specified text
config:                          shows current cli configuration
status:                          shows current cli status
clear:                           clears the console
quit:                            quit
q:                               quit
bye:                             quit
x:                               quit
help:                            help
```


#### profile management
Creating a new Profile:
- use the `new profile` command
```
? [Default : Default] new profile
? What is user client id?:
 client-id
? What is user client secret?:
 client-secret
? Provide a name (id) for the new profile:
 MyProfile
? Confirm: Create this new profile?:
 yes
profileId:                MyProfile
romPort:                  7160
clientId:                 client-id
clientSecret:             client-secret
nluDefault:               simple
nluLUISEndpoint:          
nluLUISAppId:             
nluLUISSubscriptionKey:   
nluDialogflowClientToken: 
nluDialogflowProjectId:   
nluDialogflowPrivateKey:  
nluDialogflowClientEmail: 
neo4jUrl:                 
neo4jUser:                
neo4jPassword:            
? [MyProfile : Default] 
```

#### robot management
Creating a new robot config:
- use the `new robot` command
```
? [MyProfile : new] new robot
? What is the robot type?:
 robokit
? What is robot serial name?:
 serial-name
? What is robot owner's email?:
 email
? What is robot owner's password?:
 pass
? Provide a name (id) for the new robot config:
 MyRobot
? Confirm: Create this new robot config?:
 yes
configId:   MyRobot
type:       robokit
ip:         
serialName: serial-name
email:      email
password:   pass
? [MyProfile : MyRobot] 
```

Loading a Profile:
- create a `my-profile.json` file based on the template below
- enter values for:
  - profileId (must be  unique)
  - clientId
  - clientSecret
  - ...


Profile template: i.e. `my-profile.json`
```
{
    "profileId": "Default",
    "romPort": 7160,
    "clientId": "client",
    "clientSecret": "secret",
    "nluDefault": "simple",
    "nluLUISEndpoint": "",
    "nluLUISAppId": "",
    "nluLUISSubscriptionKey": "",
    "nluDialogflowClientToken": "",
    "nluDialogflowProjectId": "",
    "nluDialogflowPrivateKey": "",
    "nluDialogflowClientEmail": "",
    "neo4jUrl": "",
    "neo4jUser": "",
    "neo4jPassword": ""
}
```