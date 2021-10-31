/**
 * @name Animations
 * @version 1.0.0
 * @description This plugin is designed to animate different objects (lists, buttons, panels, etc.) with the ability to set delays, durations, types and directions of these animations.
 * @author Mops
 * @authorLink https://github.com/Mopsgamer/
 * @website https://github.com/Mopsgamer/Animations/
 * @source https://raw.githubusercontent.com/Mopsgamer/Animations/main/Animations.plugin.js
 */

const { clear } = require('console');

module.exports = (() => {
    const config = {
        info: {
            name: 'Animations',
            authors: [
                {
                    name: 'Mops',
                    discord_id: '538010208023347200',
                    github_username: 'Mopsgamer',
                },
            ],
            version: '1.0.0',
            description: 'This plugin is designed to animate different objects (lists, buttons, panels, etc.) with the ability to set delays, durations, types and directions of these animations.',
            github: 'https://github.com/Mopsgamer/Animations/blob/main/Animations.plugin.js',
            github_raw: 'https://raw.githubusercontent.com/Mopsgamer/Animations/main/Animations.plugin.js',
        },
        main: 'index.js',
    };

    return !global.ZeresPluginLibrary ? class {
        constructor() {this._config = config;}
        getName() {return config.info.name;}
        getAuthor() {return config.info.authors.map(a => a.name).join(', ');}
        getDescription() {return config.info.description;}
        getVersion() {return config.info.version;}
        load() {
            BdApi.showConfirmationModal('Library Missing', `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {
                confirmText: 'Download Now',
                cancelText: 'Cancel',
                onConfirm: () => {
                    require('request').get('https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js', async (error, response, body) => {
                        if (error) return require('electron').shell.openExternal('https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js');
                        await new Promise(r => require('fs').writeFile(require('path').join(BdApi.Plugins.folder, '0PluginLibrary.plugin.js'), body, r));
                    });
                }
            });
        }
        start() {}
        stop() {}
    } : (([Plugin, Api]) => {
        const plugin = (Plugin, Library) => {

        const
        {DiscordSelectors, PluginUtilities, DOMTools, Modals, WebpackModules} = Api,
        {Logger, Patcher, Settings, ReactComponents} = Library;

        return class Animations extends Plugin {

            constructor() {
                super();
                
                this.defaultSettings = {
                    lists: {
                        enabled: true,
                        name: 'slide-up',
                        duration: 0.3,
                        delay: 0.06,
                        direction: 'downwards',
                        central: 12,
                        limit: 50
                    },
                    messages: {
                        enabled: true,
                        name: 'slide-right',
                        duration: 0.4,
                        delay: 2,
                        limit: 50
                    }
                }
            }
        
            getName() {return config.info.name}
            getAuthor() {return config.info.authors.map(a => a.name).join(' / ')}
            getDescription() {return config.info.description}
            getVersion() {return config.info.version}

            change() {
                let nthStyles = (()=>{
                    let result = '';
                    if(this.settings.lists.direction=='upwards') for (var i = 0; i < this.settings.lists.limit; i++) {
                        result += `:nth-child(${this.settings.lists.central*2-i}) {animation-delay:${(i * this.settings.lists.delay).toFixed(2)}s}\n\n`
                    }
                    if(this.settings.lists.direction=='both') for (var i = 0; i < this.settings.lists.limit/2; i++) {
                        result += `:nth-child(${this.settings.lists.central-i}), :nth-child(${this.settings.lists.central+i}) {animation-delay:${(i * (this.settings.lists.delay)).toFixed(2)}s}\n\n`
                    }
                    if(this.settings.lists.direction=='downwards') for (var i = 0; i < this.settings.lists.limit; i++) {
                        result += `:nth-child(${i}) {animation-delay:${(i * this.settings.lists.delay).toFixed(2)}s}\n\n`
                    }

                    for (var i = 0; i < this.settings.messages.limit; i++) {
                        result += `li.messageListItem-1-jvGY:nth-last-of-type(${i}) .messageContent-2qWWxC:not(.isSending-9nvak6)
                        {animation-delay:${(i * this.settings.messages.delay).toFixed(2)}s}\n`
                    }
                    
                    return result;
                })()
                this.styles = `
                /*ANIMATED DISCORD*/

                /*lists limit*/
                .side-8zPYf6 > :nth-child(n+${this.settings.lists.limit}),
                .content-3YMskv > :nth-child(n+${this.settings.lists.limit})
                {animation: none !important; transform: none !important}

                /* messages */
                /*nickname, date*/
                :nth-last-of-type(n+${this.settings.messages.limit}) .header-23xsNx,
                /*avatar*/
                :nth-last-of-type(n+${this.settings.messages.limit}) .avatar-1BDn8e,
                /*text*/
                :nth-last-of-type(n+${this.settings.messages.limit}) .messageContent-2qWWxC:not(.isSending-9nvak6),
                /*embed*/
                :nth-last-of-type(n+${this.settings.messages.limit}) .container-1ov-mD,
                /*blocked*/
                :nth-last-of-type(n+${this.settings.messages.limit}) .groupStart-23k01U
                {animation: none !important; transform: none !important}

                ${!this.settings.messages.enabled?'':`
                /* messages */
                /*nickname, date*/
                .header-23xsNx,
                /*avatar*/
                .avatar-1BDn8e,
                /*text*/
                .messageContent-2qWWxC:not(.isSending-9nvak6),
                /*embed*/
                .container-1ov-mD,
                /*blocked*/
                .groupStart-23k01U
                {
                    transform: scale(0);
                    animation-name: ${this.settings.messages.name};
                    animation-fill-mode: forwards;
                    animation-duration: ${this.settings.messages.duration}s;
                }
                `}
                
                ${!this.settings.lists.enabled?'':`
                /* wawes */
                /*channels*/
                .containerDefault-3tr_sE,
                .containerDefault--pIXnN,
                /*members*/
                .container-2Pjhx-,
                /*member-groups*/
                .membersGroup-v9BXpm[data-index],
                /*friends*/
                .peopleListItem-2nzedh,
                /*left-lists*/
                .header-2RyJ0Y, .item-PXvHYJ
                {
                    transform: scaleX(0);
                    animation-name: ${this.settings.lists.name};
                    animation-fill-mode: forwards;
                    animation-duration: ${this.settings.lists.duration}s;
                }
                `}
                
                @keyframes slide-up-right {
                    0% {
                        transform-origin: 0 50%;
                        transform: scaleX(0) rotate(10deg) translateY(200%);
                    }
                    100% {
                        transform-origin: 0 50%;
                        transform: scale(1) rotate(0deg) translateY(0);
                    }
                }
        
                @keyframes slide-up-left {
                    0% {
                        transform-origin: 100% 50%;
                        transform: scaleX(0) rotate(-10deg) translateY(200%);
                    }
                    100% {
                        transform-origin: 100% 50%;
                        transform: scale(1) rotate(0deg) translateY(0);
                    }
                }
        
                @keyframes slide-up {
                    0% {
                        transform: scaleY(0) translateY(200%);
                    }
                    100% {
                        transform: scale(1) translateY(0);
                    }
                }

                @keyframes slide-down-right {
                    0% {
                        transform-origin: 0 50%;
                        transform: scaleX(0) rotate(10deg) translateY(-200%);
                    }
                    100% {
                        transform-origin: 0 50%;
                        transform: scale(1) rotate(0deg) translateY(0);
                    }
                }
        
                @keyframes slide-down-left {
                    0% {
                        transform-origin: 100% 50%;
                        transform: scaleX(0) rotate(-10deg) translateY(-200%);
                    }
                    100% {
                        transform-origin: 100% 50%;
                        transform: scale(1) rotate(0deg) translateY(0);
                    }
                }
        
                @keyframes slide-down {
                    0% {
                        transform: scaleY(0) translateY(-200%);
                    }
                    100% {
                        transform: scale(1) translateY(0);
                    }
                }
        
                @keyframes slide-right {
                    0% {
                        transform-origin: 0 50%;
                        transform: scaleX(0) translateX(-100%);
                    }
                    100% {
                        transform-origin: 0 50%;
                        transform: scale(1) translateY(0);
                    }
                }

                @keyframes slide-left {
                    0% {
                        transform-origin: 100% 50%;
                        transform: scaleX(0) translateX(100%);
                    }
                    100% {
                        transform-origin: 100% 50%;
                        transform: scale(1) translateY(0);
                    }
                }
                
                @keyframes out {
                    0% {
                        transform-origin: 50% 50%;
                        transform: scale(0.8);
                    }
                    100% {
                        transform-origin: 50% 50%;
                        transform: scale(1);
                    }
                }
        
                @keyframes in {
                    0% {
                        transform-origin: 50% 50%;
                        transform: scale(1.2);
                    }
                    100% {
                        transform-origin: 50% 50%;
                        transform: scale(1);
                    }
                }
                \n${nthStyles}`;

                PluginUtilities.removeStyle(this.getName());
                setTimeout(()=>{PluginUtilities.addStyle(this.getName(), this.styles)},500);
                
            }
        
            getSettingsPanel() {
                return Settings.SettingPanel.build(this.saveSettings.bind(this),                    
                 
                    new Settings.SettingGroup('Lists').append(

                        new Settings.Switch('Using','Enabling and disabling animations.', this.settings.lists.enabled,
                            (e)=>{
                                this.settings.lists.enabled = e;
                                this.change();
                            }
                        ),

                        new Settings.Dropdown('Name', `[default ${this.defaultSettings.lists.name}] The name of the animation of the list items when they appear.`, this.settings.lists.name,
                            [
                                {label: 'In', value: 'in'},
                                {label: 'Out', value: 'out'},
                                {label: 'Slide right', value: 'slide-right'},
                                {label: 'Slide left', value: 'slide-left'},
                                {label: 'Slide up', value: 'slide-up'},
                                {label: 'Slide up (right)', value: 'slide-up-right'},
                                {label: 'Slide up (left)', value: 'slide-up-left'},
                                {label: 'Slide down', value: 'slide-down'},
                                {label: 'Slide down (right)', value: 'slide-down-right'},
                                {label: 'Slide down (left)', value: 'slide-down-left'}
                            ], (e) => {
                                this.settings.lists.name = e;
                                this.change()
                            }
                        ),

                        new Settings.Dropdown('Direction', `[default ${this.defaultSettings.lists.direction}] The direction in which the list items are built.`, this.settings.lists.direction,
                            [
                                {label: 'Downwards', value: 'downwards'},
                                {label: 'Upwards', value: 'upwards'},
                                {label: 'Both', value: 'both'}
                            ], (e) => {
                                this.settings.lists.direction = e;
                                this.change()
                            }
                        ),

                        new Settings.Slider('Central element', `[default ${this.defaultSettings.lists.central}] The number of the list item from which the lists will be built if the direction is "Both" or "Upwards".`, 6, 54, this.settings.lists.central,
                            (e) => {
                                this.settings.lists.central = e;
                                this.change()
                            }, {
                                markers: [6, 12, 18, 24, 30, 36, 42, 48, 54],
                                stickToMarkers: true
                            }
                        ),

                        new Settings.Slider('Delay', `[default ${this.defaultSettings.lists.delay}] Delay before appearing for each list item in seconds.`, 1, 10, this.settings.lists.delay,
                            (e) => {
                                this.settings.lists.delay = e;
                                this.change()
                            }, {
                                markers: [0, 0.02, 0.04, 0.06, 0.08, 0.1, 0.12, 0.15, 0.2],
                                stickToMarkers: true
                            }
                        ),

                        new Settings.Slider('Limit', `[default ${this.defaultSettings.lists.limit}] The maximum number of items in the list for which the animation will be played.`, 6, 54, this.settings.lists.limit,
                            (e) => {
                                this.settings.lists.limit = e;
                                this.change()
                            }, {
                                markers: [10, 15, 20, 25, 30, 35, 50, 65, 100],
                                stickToMarkers: true
                            }
                        ),

                        new Settings.Slider('Duration', `[default ${this.defaultSettings.lists.duration}] Animation playback speed in seconds for each list item after the delay.`, 1, 10, this.settings.lists.duration,
                            (e) => {
                                this.settings.lists.duration = e;
                                this.change()
                            }, {
                                markers: [0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 1, 1.2, 1.5, 2],
                                stickToMarkers: true
                            }
                        )

                    ),

                    new Settings.SettingGroup('Messages').append(

                        new Settings.Switch('Using','Enabling and disabling animations.', this.settings.messages.enabled,
                            (e)=>{
                                this.settings.messages.enabled = e;
                                this.change();
                            }
                        ),

                        new Settings.Dropdown('Name', `[default ${this.defaultSettings.messages.name}] The name of the animation of the messages when they appear.`, this.settings.messages.name,
                            [
                                {label: 'In', value: 'in'},
                                {label: 'Out', value: 'out'},
                                {label: 'Slide right', value: 'slide-right'},
                                {label: 'Slide left', value: 'slide-left'},
                                {label: 'Slide up', value: 'slide-up'},
                                {label: 'Slide up (right)', value: 'slide-up-right'},
                                {label: 'Slide up (left)', value: 'slide-up-left'},
                                {label: 'Slide down', value: 'slide-down'},
                                {label: 'Slide down (right)', value: 'slide-down-right'},
                                {label: 'Slide down (left)', value: 'slide-down-left'}
                            ], (e) => {
                                this.settings.messages.name = e;
                                this.change()
                            }
                        ),

                        new Settings.Slider('Delay', `[default ${this.defaultSettings.messages.delay}] Delay before appearing for each message in seconds.`, 1, 10, this.settings.messages.delay,
                            (e) => {
                                this.settings.messages.delay = e;
                                this.change()
                            }, {
                                markers: [0, 0.02, 0.04, 0.06, 0.08, 0.1, 0.12, 0.15, 0.2],
                                stickToMarkers: true
                            }
                        ),

                        new Settings.Slider('Limit', `[default ${this.defaultSettings.messages.limit}] The maximum number of items in the list for which the animation will be played.`, 6, 54, this.settings.messages.limit,
                            (e) => {
                                this.settings.messages.limit = e;
                                this.change()
                            }, {
                                markers: [10, 15, 20, 25, 30, 35, 50, 65, 100],
                                stickToMarkers: true
                            }
                        ),

                        new Settings.Slider('Duration', `[default ${this.defaultSettings.messages.duration}] Animation playback speed in seconds for each message after the delay.`, 1, 10, this.settings.messages.duration,
                            (e) => {
                                this.settings.messages.duration = e;
                                this.change()
                            }, {
                                markers: [0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 1, 1.2, 1.5, 2],
                                stickToMarkers: true
                            }
                        )

                    )

                )
            }
        
            start() {
                this.settings = this.loadSettings(this) || this.defaultSettings

                this.change()
            }
            
            stop(){
                PluginUtilities.removeStyle(this.getName());
            }
    
        }

};
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();
