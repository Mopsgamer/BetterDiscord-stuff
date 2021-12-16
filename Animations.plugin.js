/**
 * @name Animations
 * @version 1.0.4.2
 * @description This plugin is designed to animate different objects (lists, buttons, panels, etc.) with the ability to set delays, durations, types and directions of these animations.
 * @author Mops
 * @authorLink https://github.com/Mopsgamer/
 * @website https://github.com/Mopsgamer/BetterDiscord-codes/tree/Animations
 * @source https://raw.githubusercontent.com/Mopsgamer/BetterDiscord-codes/Animations/Animations.plugin.js
 */

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
            version: '1.0.4.2',
            description: 'This plugin is designed to animate different objects (lists, buttons, panels, etc.) with the ability to set delays, durations, types and directions of these animations.',
            github: 'https://github.com/Mopsgamer/Animations/blob/main/Animations.plugin.js',
            github_raw: 'https://raw.githubusercontent.com/Mopsgamer/Animations/main/Animations.plugin.js',
        },
        changelog: [
            //{"title": "New Stuff", "items": ["Absolute message animation."]},
            //{"title": "Improvements", "type": "improved", "items": ["Changed the message animation delay values.", "The default values have been changed.", "Now the threads are animated in one piece together with the channels."]},
            {"title": "Fixes", "type": "fixed", "items": ["Animations could not be started. (probably №2)"]}
        ],
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
                    panelFix: true,
                    lists: {
                        enabled: true,
                        name: 'slide-up',
                        duration: 0.3,
                        delay: 0.06,
                        direction: 'downwards',
                        limit: 60
                    },
                    messages: {
                        enabled: true,
                        name: 'slide-right',
                        duration: 0.4,
                        delay: 0.06,
                        limit: 30
                    }
                }

                this.settings = PluginUtilities.loadSettings("Animations");
            }
        
            getName() {return config.info.name}
            getAuthor() {return config.info.authors.map(a => a.name).join(' / ')}
            getDescription() {return config.info.description}
            getVersion() {return config.info.version}

            get countStyles () {
                let result = '';

                let notSelector = '.container-3JKcAb > .containerDefault--pIXnN';

                var selectors = [
                    '.containerDefault-3tr_sE',
                    '.container-3JKcAb',
                    '.containerDefault--pIXnN',
                    '.container-3iAQ-0',

                    '.container-2Pjhx-',
                    '.membersGroup-v9BXpm[data-index]',
                    '.peopleListItem-2nzedh',
                    '.header-2RyJ0Y',
                    '.item-PXvHYJ'
                ]

                selectors.forEach(selector=>{
                    let min = function (a,b){return a>b?a:b}
                    let count = min(document.querySelectorAll(selector).length, this.settings.lists.limit)

                    if(this.settings.lists.direction=='downwards') for (var i = 1; i < count+1; i++) {
                        result += `${selector}:nth-child(${i}):not(${notSelector}) `
                        +`{animation-delay: ${((i-1) * this.settings.lists.delay).toFixed(2)}s}\n\n`
                    }
                    if(this.settings.lists.direction=='upwards') for (var i = 1; i < count+1; i++) {
                        result += `${selector}:nth-last-child(${i}):not(${notSelector}) `
                        +`{animation-delay: ${((i-1) * this.settings.lists.delay).toFixed(2)}s}\n\n`
                    }
                    
                })
                
                return result;

            }

            changeStyles() {
                let animPrevStyles = (()=>{
                    let result = '';

                    var names = [
                        'in',
                        'out',
                        'slide-right',
                        'slide-left',
                        'slide-up',
                        'slide-up-right',
                        'slide-up-left',
                        'slide-down',
                        'slide-down-right',
                        'slide-down-left'
                    ]

                    names.forEach(animName=>{for(var i=1;i<5;i++) {
                        result+=`.animPreview[data-animation="${animName}"]:hover > .tempBlock:nth-child(${i})`
                        +` {transform: scale(0); animation-name: ${animName}; animation-fill-mode: forwards; animation-duration: 0.3s; animation-delay: ${(i-1)*0.06}s;}\n`
                        }
                    })
                    
                    return result;
                })()

                let nthStyles = (()=>{
                    let result = '';

                    result+=`[data-animation="downwards"]:hover .tempBlock, [data-animation="upwards"]:hover .tempBlock {animation-name: out; animation-duration: 0.3s;}\n\n`;
                    for (var i = 1; i < 5; i++) {
                        result += `[data-animation="downwards"] .tempBlock:nth-child(${i}) {animation-delay:${((i-1) * this.settings.lists.delay).toFixed(2)}s}\n\n`
                    }
                    for (var i = 1; i < 5; i++) {
                        result += `[data-animation="upwards"] .tempBlock:nth-child(${2*2+1-i}) {animation-delay:${((i-1) * this.settings.lists.delay).toFixed(2)}s}\n\n`
                    }

                    for (var i = 1; i < this.settings.messages.limit; i++) {
                        result += `.scrollerInner-2YIMLh > :nth-last-child(${i})
                        {animation-delay:${((i-1) * this.settings.messages.delay).toFixed(2)}s}\n`
                    }
                    
                    return result;
                })()

                this.styles = `
                /*ANIMATED DISCORD*/

                /*fix panel*/
                ${this.settings.panelFix?
                `.root-1gCeng {max-height: 100%}
                .marginBottom20-32qID7 {padding: 0 10px 0 5px}`
                :'/*disabled*/'}

                /*lists limit*/
                .side-8zPYf6 > :nth-child(n+${this.settings.lists.limit}),
                .content-3YMskv > :nth-child(n+${this.settings.lists.limit})
                {animation: none !important; transform: none !important}

                /* messages */
                /*nickname, date*/
                :nth-last-child(n+${this.settings.messages.limit}) .header-23xsNx,
                /*avatar*/
                :nth-last-child(n+${this.settings.messages.limit}) .avatar-1BDn8e,
                /*text*/
                .scrollerInner-2YIMLh > :nth-last-child(n+${this.settings.messages.limit}),
                /*embed*/
                :nth-last-child(n+${this.settings.messages.limit}) .container-1ov-mD,
                /*blocked*/
                :nth-last-child(n+${this.settings.messages.limit}) .groupStart-23k01U
                {animation: none !important; transform: none !important}

                ${!this.settings.messages.enabled?'':`
                /* messages */
                /*nickname, date*/
                .header-23xsNx,
                /*avatar*/
                .avatar-1BDn8e,
                /*text*/
                .scrollerInner-2YIMLh > *,
                /*embed*/
                .container-1ov-mD,
                /*blocked*/
                .groupStart-23k01U
                {
                    z-index: 0;
                    transform: scale(0);
                    animation-fill-mode: forwards;
                    animation-name: ${this.settings.messages.name};
                    animation-duration: ${this.settings.messages.duration}s;
                }
                `}
                
                ${!this.settings.lists.enabled?'':`
                /* wawes */
                /*channels*/
                .containerDefault-3tr_sE,
                .container-3JKcAb,
                .containerDefault--pIXnN,
                /*search*/
                .container-3iAQ-0,
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

                /**Keyframes**/

                .container-3JKcAb > svg {
                    transform: scale(0);
                }

                .container-3JKcAb > svg {
                    animation-timing-function: linear;
                    animation-name: slide-left;
                    animation-duration: ${this.settings.lists.duration}s;
                    animation-fill-mode: forwards;
                }

                /****/

                @keyframes slide-up {
                    0% {
                        transform: scaleY(0) translateY(200%);
                    }
                    100% {
                        transform: scale(1) translateY(0);
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
                \n${animPrevStyles}
                \n${nthStyles}`;

                PluginUtilities.removeStyle('Animations-main');
                PluginUtilities.addStyle('Animations-main', this.styles);

                PluginUtilities.removeStyle('Animations-count');
                PluginUtilities.addStyle('Animations-count', this.countStyles);
                
            }

            closeSettings() {
                document.querySelector('.bd-addon-modal-footer > .bd-button').click()
            }
        
            getSettingsPanel() {

                var ButtonsPanel = function(label, options=[]) {
                    var buttons = [];
                    options.forEach(option=>{
                        var colorClass;
                        switch (option.color) {
                            case 'blurple':
                                colorClass = 'colorBrand-3pXr91'
                                break;
                            case 'red':
                                colorClass = 'colorRed-1TFJan'
                                break;
                            case 'gray': case 'grey':
                                colorClass = 'colorPrimary-3b3xI6'
                                break;
                            case 'green':
                                colorClass = 'colorGreen-29iAKY'
                                break;
                            case 'bd':
                                colorClass = 'bd-button'
                                break;
                        
                            default:
                                colorClass = 'bd-button'
                                break;
                        }

                        buttons.push([
                            BdApi.React
                            .createElement('button', {
                                style: {
                                    display: 'inline-block',
                                    width: option.width ?? 'fit-content',
                                    padding: option.padding ?? '4px 8px',
                                    margin: '4px 8px'
                                    
                                },
                                id: option.id,
                                class: `lookFilled-1Gx00P button-38aScr sizeSmall-2cSMqn ${colorClass}`,
                                onClick: option.onclick
                                },
                                BdApi.React.createElement('div', {
                                    class: 'contents-18-Yxp',
                                    style: {'pointer-events': 'none'}
                                },
                                option.label
                                )
                            )
                        ])
                    })
                    
                    class Panel extends BdApi.React.Component {
                        render() {
                            return BdApi.React.createElement('div', {
                                class: 'btnsPanel'
                            },
                            [
                                label?BdApi.React.createElement('label', {
                                    class: 'title-31JmR4'
                                }, label):null,
                                ...buttons
                            ]
                            )
                        }
                    }

                    return Panel;
                }

                var PreviewsPanel = function(options=[], value, onclick) {

                    var previews = []
                    options.forEach(option=>{
                        var tempBlocks = []
                            for (var i = 0; i < 4; i++) {
                                tempBlocks[i] = BdApi.React.createElement('div', {
                                    class: 'tempBlock'
                                })
                            }

                        previews.push(
                            BdApi.React
                            .createElement('div', {
                                'data-animation': option.value,
                                'data-type': option.type,
                                class: `animPreview${value==option.value?' active':''} preview-2nSL_2 group-spacing-16 cardPrimaryOutline-29Ujqw card-3Qj_Yx`,
                                onClick: ()=>{
                                    onclick(option.value);
                                    
                                    var sections = document.querySelectorAll(`.animPreview[data-type="${option.type}"]`);
                                    for (i = 0; i < sections.length; i++) sections[i].classList.remove('active');
                                    document.querySelector(`.animPreview[data-animation="${option.value}"][data-type="${option.type}"]`).classList.add('active');
                                }
                            },
                            [...tempBlocks, BdApi.React.createElement('div', {
                                class: 'animPreviewLabel'
                                }, option.label
                            )]
                            )
                        )
                    })
                    
                    class Panel extends BdApi.React.Component {
                        render() {
                            return BdApi.React
                            .createElement('div', {class: 'animPreviewsPanel'}, previews )
                        }
                    }

                    return Panel;
                }

                return Settings.SettingPanel.build(
                    ()=>{
                        this.saveSettings.bind(this)
                    },

                    new Settings.SettingField(null, null, ()=>{},
                    ButtonsPanel(null, [
                        {
                            color: 'blurple', label: 'Reset settings', id: 'reset-animations-settings', onclick: (e) => {
                            this.settings = this.defaultSettings;
                            PluginUtilities.saveSettings("Animations", this.defaultSettings)
                            this.changeStyles();
                            this.closeSettings();
                            }
                        },
                        {
                            color: this.settings.panelFix?'red':'green', label: this.settings.panelFix?'Take it back':'Fix this window', id: 'fix-this-window', onclick: (e) => {
                            this.settings.panelFix = !this.settings.panelFix;
                            let button = document.getElementById('fix-this-window')
                            if (this.settings.panelFix) {
                                button.classList.remove('colorGreen-29iAKY')
                                button.classList.add('colorRed-1TFJan')
                                button.innerText = 'Take it back'
                            } else {
                                button.classList.remove('colorRed-1TFJan')
                                button.classList.add('colorGreen-29iAKY')
                                button.innerText = 'Fix this window'
                            }
                            PluginUtilities.saveSettings("Animations", this.settings)
                            this.changeStyles();
                            }
                        }
                    ])
                    ),
                 
                    new Settings.SettingGroup('Lists').append(

                        new Settings.Switch('Using','Enabling and disabling animations.', this.settings.lists.enabled,
                            (e)=>{
                                this.settings.lists.enabled = e;
                                this.changeStyles();
                            }
                        ),

                        new Settings.SettingField('Name', `[default ${this.defaultSettings.lists.name}] The name of the animation of the list items when they appear.`, ()=>{},
                            PreviewsPanel([
                                { label: 'In', type: 'lists-name', value: 'in' },
                                { label: 'Out', type: 'lists-name', value: 'out' },
                                { label: 'Slide right', type: 'lists-name', value: 'slide-right' },
                                { label: 'Slide left', type: 'lists-name', value: 'slide-left' },
                                { label: 'Slide up', type: 'lists-name', value: 'slide-up' },
                                { label: 'Slide down', type: 'lists-name', value: 'slide-down' },
                                { label: 'Slide up (right)', type: 'lists-name', value: 'slide-up-right' },
                                { label: 'Slide up (left)', type: 'lists-name', value: 'slide-up-left' },
                                { label: 'Slide down (right)', type: 'lists-name', value: 'slide-down-right' },
                                { label: 'Slide down (left)', type: 'lists-name', value: 'slide-down-left' }
                            ], this.settings.lists.name, (e)=>{
                                this.settings.lists.name = e;
                                PluginUtilities.saveSettings("Animations", this.settings);
                                this.changeStyles()
                            }),
                            {noteOnTop: true}
                        ),

                        new Settings.SettingField('Direction [unstable]', `[default ${this.defaultSettings.lists.direction}] The direction in which the list items are built.`, ()=>{},
                            PreviewsPanel([
                                { label: 'Downwards', type: 'lists-direction', value: 'downwards' },
                                { label: 'Upwards', type: 'lists-direction', value: 'upwards' }
                            ], this.settings.lists.direction, (e)=>{
                                this.settings.lists.direction = e;
                                PluginUtilities.saveSettings("Animations", this.settings);
                                this.changeStyles()
                            }),
                            {noteOnTop: true}
                        ),

                        new Settings.Slider('Delay', `[default ${this.defaultSettings.lists.delay}] Delay before appearing for each list item in seconds.`, 1, 10, this.settings.lists.delay,
                            (e) => {
                                this.settings.lists.delay = e;
                                this.changeStyles()
                            }, {
                                markers: [0, 0.01, 0.02, 0.04, 0.06, 0.08, 0.1, 0.12, 0.15, 0.2],
                                stickToMarkers: true
                            }
                        ),

                        new Settings.Slider('Limit', `[default ${this.defaultSettings.lists.limit}] The maximum number of items in the list for which the animation will be played.`, 6, 54, this.settings.lists.limit,
                            (e) => {
                                this.settings.lists.limit = e;
                                this.changeStyles()
                            }, {
                                markers: [10, 15, 20, 25, 30, 35, 50, 65, 100],
                                stickToMarkers: true
                            }
                        ),

                        new Settings.Slider('Duration', `[default ${this.defaultSettings.lists.duration}] Animation playback speed in seconds for each list item after the delay.`, 1, 10, this.settings.lists.duration,
                            (e) => {
                                this.settings.lists.duration = e;
                                this.changeStyles()
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
                                this.changeStyles();
                            }
                        ),

                        new Settings.SettingField('Name', `[default ${this.defaultSettings.messages.name}] The name of the animation of the messages when they appear.`, ()=>{},
                            PreviewsPanel([
                                { label: 'In', type: 'messages-name', value: 'in' },
                                { label: 'Out', type: 'messages-name', value: 'out' },
                                { label: 'Slide right', type: 'messages-name', value: 'slide-right' },
                                { label: 'Slide left', type: 'messages-name', value: 'slide-left' },
                                { label: 'Slide up', type: 'messages-name', value: 'slide-up' },
                                { label: 'Slide down', type: 'messages-name', value: 'slide-down' },
                                { label: 'Slide up (right)', type: 'messages-name', value: 'slide-up-right' },
                                { label: 'Slide up (left)', type: 'messages-name', value: 'slide-up-left' },
                                { label: 'Slide down (right)', type: 'messages-name', value: 'slide-down-right' },
                                { label: 'Slide down (left)', type: 'messages-name', value: 'slide-down-left' }
                            ], this.settings.messages.name, (e)=>{
                                this.settings.messages.name = e;
                                PluginUtilities.saveSettings("Animations", this.settings);
                                this.changeStyles()
                            }),
                            {noteOnTop: true}
                        ),

                        new Settings.Slider('Delay', `[default ${this.defaultSettings.messages.delay}] Delay before appearing for each message in seconds.`, 1, 10, this.settings.messages.delay,
                            (e) => {
                                this.settings.messages.delay = e;
                                this.changeStyles()
                            }, {
                                markers: [0, 0.01, 0.02, 0.04, 0.06, 0.08, 0.1, 0.12, 0.15, 0.2],
                                stickToMarkers: true
                            }
                        ),

                        new Settings.Slider('Limit', `[default ${this.defaultSettings.messages.limit}] The maximum number of items in the list for which the animation will be played.`, 6, 54, this.settings.messages.limit,
                            (e) => {
                                this.settings.messages.limit = e;
                                this.changeStyles()
                            }, {
                                markers: [10, 15, 20, 25, 30, 35, 50, 65, 100],
                                stickToMarkers: true
                            }
                        ),

                        new Settings.Slider('Duration', `[default ${this.defaultSettings.messages.duration}] Animation playback speed in seconds for each message after the delay.`, 1, 10, this.settings.messages.duration,
                            (e) => {
                                this.settings.messages.duration = e;
                                this.changeStyles()
                            }, {
                                markers: [0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 1, 1.2, 1.5, 2],
                                stickToMarkers: true
                            }
                        )

                    )

                )
            }
        
            start() {
                this.reqStyles = 
                `/*own components*/

                .animPreview {
                    width: 20%;
                    height: 100pt;
                    margin: 6px 8px;
                    padding: 4px;
                    display: inline-block;
                }
                
                .animPreview .tempBlock {
                    width: auto;
                    height: 18pt;
                    margin: 4px;
                    border-radius: 3pt;
                    background-color: var(--interactive-normal);
                }
                
                .animPreview .animPreviewLabel {
                    position: absolute;
                    padding-left: 4px;
                    bottom: 5pt;
                    color: var(--interactive-normal);
                    font-size: 10pt;
                }

                .animPreview.active {
                    background-color: var(--brand-experiment);
                }

                .animPreview.active .tempBlock {
                    background-color: #fff;
                }
                
                .animPreview.active .animPreviewLabel {
                    color: #fff;
                }`

                PluginUtilities.removeStyle('Animations-req');
                setTimeout(()=>{
                    PluginUtilities.addStyle('Animations-req', this.reqStyles)
                }, 100);

                this.changeStyles()
            }
            
            stop(){

                PluginUtilities.removeStyle('Animations-main');
                PluginUtilities.removeStyle('Animations-req');
                PluginUtilities.removeStyle('Animations-count');

            }
    
        }

};
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();