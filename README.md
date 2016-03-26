# pomodoro-code

A pomodoro timer inside your Visual Studio Code IDE

![pomodoro-code](https://cloud.githubusercontent.com/assets/6053067/11303463/5f8a33aa-8fa3-11e5-9f41-2c8ed47b9446.gif)

## Commands

There is a list of commands you can use in VS Code :

* Start Pomodoro
    * Start a new Pomodoro
* Pause Pomodoro
    * Pause the current Pomodoro and wait
* Reset Pomodoro
    * Stop the existing Pomodoro and wait to start with a fresh new one
* Configure Pomodoro
    * Open `settings.json` file to update the configuration of your Pomodoro session

## Status Bar

The status bar contains the current timer of your Pomodoro. 
It also contains buttons to start or stop Pomodoro.

## Alerts

When Work/Pause timer is over, it alerts you by showing you a pop-up.

## Configuration file

The configuration file is a simple json object contained in the `settings.json` of your global config (user settings). 
By default, if there is no configuration, you can use the extension with a single Pomodoro (25 working minutes and 5 pausing minutes).
The `settings.json` file will provide you a way to change your Pomodoro session as you want, see an example :

```
// Place your settings in this file to overwrite default and user settings.
{
    "pomodori": [
        {
            "work": 25,
            "pause": 5	
        },
        {
            "work": 25,
            "pause": 5	
        },
        {
            "work": 25,
            "pause": 5	
        },
        {
            "work": 25,
            "pause": 5	
        }
    ]
}
```

## Credits

Thanks [José Campos](https://thenounproject.com/jcampos/) to let me use the Pomodoro icon.
