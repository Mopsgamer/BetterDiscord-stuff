/**
 * @name Animations
 * @version 1.0.7
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
            version: '1.0.7',
            description: 'This plugin is designed to animate different objects (lists, buttons, panels, etc.) with the ability to set delays, durations, types and directions of these animations.',
            github: 'https://github.com/Mopsgamer/Animations/blob/main/Animations.plugin.js',
            github_raw: 'https://raw.githubusercontent.com/Mopsgamer/Animations/main/Animations.plugin.js',
        },
        changelog: [
            //{"title": "New Stuff", "items": ["Absolute message animation."]},
            //{ "title": "Improvements", "type": "improved", "items": ["Slider for previewing."] },
            { "title": "Fixes", "type": "fixed", "items": ["Settings are not saved when you restart Discord. Finally."] }
        ],
        main: 'index.js',
    };

    return !global.ZeresPluginLibrary ? class {
        constructor() { this._config = config; }
        getName() { return config.info.name; }
        getAuthor() { return config.info.authors.map(a => a.name).join(', '); }
        getDescription() { return config.info.description; }
        getVersion() { return config.info.version; }
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
        start() { }
        stop() { }
    } : (([Plugin, Api]) => {
        const plugin = (Plugin, Library) => {

            const
                { DiscordSelectors, PluginUtilities, DOMTools, Modals, WebpackModules } = Api,
                { Logger, Patcher, Settings, ReactComponents } = Library;

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

                    this.settings = PluginUtilities.loadSettings("Animations", this.defaultSettings);
                }

                getName() { return config.info.name }
                getAuthor() { return config.info.authors.map(a => a.name).join(' / ') }
                getDescription() { return config.info.description }
                getVersion() { return config.info.version }

                get countStyles() {
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

                    selectors.forEach(selector => {
                        let min = function (a, b) { return a > b ? a : b }
                        let count = min(document.querySelectorAll(selector).length, this.settings.lists.limit)

                        if (this.settings.lists.direction == 'downwards') for (var i = 1; i < count + 1; i++) {
                            result += `${selector}:nth-child(${i}):not(${notSelector}) `
                                + `{animation-delay: ${((i - 1) * this.settings.lists.delay).toFixed(2)}s}\n\n`
                        }
                        if (this.settings.lists.direction == 'upwards') for (var i = 1; i < count + 1; i++) {
                            result += `${selector}:nth-last-child(${i}):not(${notSelector}) `
                                + `{animation-delay: ${((i - 1) * this.settings.lists.delay).toFixed(2)}s}\n\n`
                        }

                    })

                    return result;

                }

                changeStyles() {
                    let animPrevStyles = (() => {
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
                            'slide-down-left',
                            'skew-right',
                            'skew-left'
                        ]

                        var directions = [
                            'downwards',
                            'upwards'
                        ]

                        if(!names.includes(this.settings.lists.name)) {
                            this.settings.lists.name = this.defaultSettings.lists.name;
                            PluginUtilities.saveSettings("Animations", this.settings)
                        }

                        if(!directions.includes(this.settings.lists.direction)) {
                            this.settings.lists.direction = this.defaultSettings.lists.direction;
                            PluginUtilities.saveSettings("Animations", this.settings)
                        }

                        if(!names.includes(this.settings.messages.name)) {
                            this.settings.messages.name = this.defaultSettings.messages.name;
                            PluginUtilities.saveSettings("Animations", this.settings)
                        }

                        names.forEach(animName => {
                            for (var i = 1; i < 5; i++) {
                                result += `.animPreview[data-animation="${animName}"]:hover > .animTempBlock:nth-child(${i})`
                                    + ` {transform: scale(0); animation-name: ${animName}; animation-fill-mode: forwards; animation-duration: 0.3s; animation-delay: ${(i - 1) * 0.06}s;}\n`
                            }
                        })

                        return result;
                    })()

                    let nthStyles = (() => {
                        let result = '';

                        result += `[data-animation="downwards"]:hover .animTempBlock, [data-animation="upwards"]:hover .animTempBlock {animation-name: out; animation-duration: 0.3s;}\n\n`;
                        for (var i = 1; i < 5; i++) {
                            result += `[data-animation="downwards"] .animTempBlock:nth-child(${i}) {animation-delay:${((i - 1) * this.settings.lists.delay).toFixed(2)}s}\n\n`
                        }
                        for (var i = 1; i < 5; i++) {
                            result += `[data-animation="upwards"] .animTempBlock:nth-child(${2 * 2 + 1 - i}) {animation-delay:${((i - 1) * this.settings.lists.delay).toFixed(2)}s}\n\n`
                        }

                        for (var i = 1; i < this.settings.messages.limit; i++) {
                            result += `.scrollerInner-2YIMLh > :nth-last-child(${i})
                        {animation-delay:${((i - 1) * this.settings.messages.delay).toFixed(2)}s}\n`
                        }

                        return result;
                    })()

                    this.styles = `
                /*ANIMATED DISCORD*/

                /*fix panel*/
                ${this.settings.panelFix ?
                            `.root-1gCeng {max-height: 100%}
                .marginBottom20-32qID7 {padding: 0 10px 0 5px}`
                            : '/*disabled*/'}

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

                ${!this.settings.messages.enabled ? '' : `
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
                    transform: scale(0);
                    animation-fill-mode: forwards;
                    animation-name: ${this.settings.messages.name};
                    animation-duration: ${this.settings.messages.duration}s;
                }

                /*lines-forward-messages fix*/
                .divider-JfaTT5 {z-index: 0}
                `}
                
                ${!this.settings.lists.enabled ? '' : `
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

                @keyframes out {
                    0% {
                        transform-origin: 50% 50%;
                        transform: scale(0.7);
                    }
                    100% {
                        transform-origin: 50% 50%;
                        transform: scale(1);
                    }
                }
        
                @keyframes in {
                    0% {
                        transform-origin: 50% 50%;
                        transform: scale(1.3);
                    }
                    100% {
                        transform-origin: 50% 50%;
                        transform: scale(1);
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
                        transform: scale(1) translateX(0);
                    }
                }

                @keyframes slide-left {
                    0% {
                        transform-origin: 100% 50%;
                        transform: scaleX(0) translateX(100%);
                    }
                    100% {
                        transform-origin: 100% 50%;
                        transform: scale(1) translateX(0);
                    }
                }
        
                @keyframes skew-right {
                    0% {
                        transform-origin: 50% 50%;
                        transform: skewX(-30deg) scale(0.8);
                    }
                    100% {
                        transform-origin: 50% 50%;
                        transform: skewX(0) scale(1);
                    }
                }
                
                @keyframes skew-left {
                    0% {
                        transform-origin: 50% 50%;
                        transform: skewX(30deg) scale(0.8);
                    }
                    100% {
                        transform-origin: 50% 50%;
                        transform: skewX(0) scale(1);
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

                    var ButtonsPanel = function (label, options = []) {
                        var buttons = [];
                        options.forEach(option => {
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
                                            style: { 'pointer-events': 'none' }
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
                                        label ? BdApi.React.createElement('label', {
                                            class: 'title-31JmR4'
                                        }, label) : null,
                                        ...buttons
                                    ]
                                )
                            }
                        }

                        return Panel;
                    }

                    var PreviewsPanel = function (previewsTemp = [], options = {}, value, onclick) {

                        var swipeButtons = [];
                        var previews = [];
                        var containers = [];
                        var openedPage = 1;
                        var containersCount = 0;

                        previewsTemp.forEach((template, index) => {
                            if(value == template.value) openedPage = Math.ceil((index+1)/8);
                            var tempBlocks = []
                            for (var i = 0; i < 4; i++) {
                                tempBlocks[i] = BdApi.React.createElement('div', {
                                    class: 'animTempBlock'
                                })
                            }

                            previews.push(
                                BdApi.React
                                    .createElement('div', {
                                        'data-animation': template.value,
                                        class: `animPreview ${value == template.value ? 'enabled' : ''} preview-2nSL_2 group-spacing-16 cardPrimaryOutline-29Ujqw card-3Qj_Yx`,
                                        onClick: (e) => {
                                            onclick(template.value);

                                            var sections = document.querySelectorAll(`[data-type="${options.type}"] .animPreview`);
                                            for (i = 0; i < sections.length; i++) sections[i].classList.remove('enabled');
                                            e.target.classList.add('enabled');
                                        }
                                    },
                                        [...tempBlocks, BdApi.React.createElement('div', {
                                            class: 'animPreviewLabel'
                                        }, template.label
                                        )]
                                    )
                            )
                        })

                        for(containersCount=1; containersCount<=Math.ceil(previewsTemp.length/8); containersCount++) {
                            swipeButtons.push(
                                BdApi.React
                                .createElement('div',
                                {
                                    class: `animPreviewSwipeButton ${openedPage==containersCount?'enabled ':''}title-3sZWYQ`,
                                    'data-page': containersCount,
                                    onClick: (e)=>{
                                        for(var i=0, len=e.target.closest('.animPreviewsPanel').querySelectorAll(`.animPreviewsContainer`).length;i<len;i++)
                                            e.target.closest('.animPreviewsPanel').querySelectorAll(`.animPreviewsContainer`)[i].classList.remove('show');
                                        e.target.closest('.animPreviewsPanel').querySelector(`.animPreviewsContainer:nth-child(${e.target.getAttribute('data-page')})`).classList.add('show');

                                        var sections = document.querySelectorAll(`[data-type="${options.type}"] .animPreviewSwipeButton`);
                                        for (i = 0; i < sections.length; i++) sections[i].classList.remove('enabled');
                                        e.target.classList.add('enabled');
                                    }
                                },
                                containersCount)
                            );

                            var pages = [];

                            var i=0;
                            while(i<8) {
                                pages.push(previews[(containersCount-1)*8+i])
                                i++
                            }

                            containers.push(
                                BdApi.React
                                .createElement('div',
                                    {
                                        class: `animPreviewsContainer ${openedPage==containersCount?'show':''} ${previewsTemp.length<9?'compact':''}`,
                                    },
                                    pages
                                )
                            )
                            
                        }

                        class Panel extends BdApi.React.Component {
                            render() {
                                return BdApi.React
                                    .createElement('div',
                                        {
                                            class: 'animPreviewsPanel',
                                            'data-type': options.type
                                        },
                                        [
                                            ...containers,
                                            containers.length>1?BdApi.React
                                            .createElement('div',
                                                {
                                                    class: 'animPreviewsButtons',
                                                },
                                                swipeButtons
                                            ):null
                                        ])
                            }
                        }

                        return Panel;
                    }

                    return Settings.SettingPanel.build(
                        this.saveSettings.bind(this),

                        new Settings.SettingField(null, null, () => { },
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
                                    color: this.settings.panelFix ? 'red' : 'green', label: this.settings.panelFix ? 'Take it back' : 'Fix this window', id: 'fix-this-window', onclick: (e) => {
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

                            new Settings.Switch('Using', 'Enabling and disabling animations.', this.settings.lists.enabled,
                                (e) => {
                                    this.settings.lists.enabled = e;
                                    this.changeStyles();
                                }
                            ),

                            new Settings.SettingField('Name', `[default ${this.defaultSettings.lists.name}] The name of the animation of the list items when they appear.`, () => { },
                                PreviewsPanel([
                                    { label: 'In', value: 'in' },
                                    { label: 'Out', value: 'out' },
                                    { label: 'Slide right', value: 'slide-right' },
                                    { label: 'Slide left', value: 'slide-left' },
                                    { label: 'Slide up', value: 'slide-up' },
                                    { label: 'Slide down', value: 'slide-down' },
                                    { label: 'Slide up (right)', value: 'slide-up-right' },
                                    { label: 'Slide up (left)', value: 'slide-up-left' },
                                    { label: 'Slide down (right)', value: 'slide-down-right' },
                                    { label: 'Slide down (left)', value: 'slide-down-left' },
                                    { label: 'Skew right', value: 'skew-right' },
                                    { label: 'Skew left', value: 'skew-left' },
                                ], {
                                    type: 'lists-name'
                                },
                                this.settings.lists.name, (e) => {
                                    this.settings.lists.name = e;
                                    PluginUtilities.saveSettings("Animations", this.settings);
                                    this.changeStyles()
                                }),
                                { noteOnTop: true }
                            ),

                            new Settings.SettingField('Direction', `[default ${this.defaultSettings.lists.direction}] The direction in which the list items are built.`, () => { },
                                PreviewsPanel([
                                    { label: 'Downwards', value: 'downwards' },
                                    { label: 'Upwards', value: 'upwards' }
                                ], {
                                    type: 'lists-direction'
                                }, this.settings.lists.direction, (e) => {
                                    this.settings.lists.direction = e;
                                    PluginUtilities.saveSettings("Animations", this.settings);
                                    this.changeStyles()
                                }),
                                { noteOnTop: true }
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

                            new Settings.Switch('Using', 'Enabling and disabling animations.', this.settings.messages.enabled,
                                (e) => {
                                    this.settings.messages.enabled = e;
                                    this.changeStyles();
                                }
                            ),

                            new Settings.SettingField('Name', `[default ${this.defaultSettings.messages.name}] The name of the animation of the messages when they appear.`, () => { },
                                PreviewsPanel([
                                    { label: 'In', value: 'in' },
                                    { label: 'Out', value: 'out' },
                                    { label: 'Slide right', value: 'slide-right' },
                                    { label: 'Slide left', value: 'slide-left' },
                                    { label: 'Slide up', value: 'slide-up' },
                                    { label: 'Slide down', value: 'slide-down' },
                                    { label: 'Slide up (right)', value: 'slide-up-right' },
                                    { label: 'Slide up (left)', value: 'slide-up-left' },
                                    { label: 'Slide down (right)', value: 'slide-down-right' },
                                    { label: 'Slide down (left)', value: 'slide-down-left' },
                                    { label: 'Skew right', value: 'skew-right' },
                                    { label: 'Skew left', value: 'skew-left' },
                                ], {
                                    type: 'messages-name'
                                }, this.settings.messages.name, (e) => {
                                    this.settings.messages.name = e;
                                    PluginUtilities.saveSettings("Animations", this.settings);
                                    this.changeStyles()
                                }),
                                { noteOnTop: true }
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

                    /*.animPreviewsPanel {

                    }*/

                    .animPreview {
                        box-sizing: border-box;
                        width: 22%;
                        height: 110pt;
                        margin: 6px 8px;
                        padding: 5px;
                        display: inline-block;
                    }
                    
                    .animPreview .animTempBlock {
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

                    .animPreviewsContainer {
                        display: none;
                        border: 1px solid rgb(32, 34, 37);
                        border-radius: 3pt;
                        height: calc((110pt + 6px + (5px)*2)*2);
                        overflow: hidden;
                    }

                    .animPreviewsContainer.show {
                        display: block;
                    }

                    .animPreviewsContainer.compact {
                        border: none;
                        height: fit-content;
                    }

                    .animPreviewsButtons {
                        margin: 0 auto;
                        width: fit-content;
                    }

                    .animPreviewSwipeButton {
                        display: inline-block;
                        min-width: 10px;
                        width: fit-content;
                        height: 0;
                        padding: 5px 10px 25px 10px;
                        color: var(--interactive-normal);
                        text-align: center;
                        font-size: 18px;
                        background-color: rgb(47, 49, 54);
                        border: 1px solid rgb(32, 34, 37);
                        border-radius: 100px;
                        margin: 5px 5px;
                    }

                    .animPreviewSwipeButton:first-child {
                        margin: 5px 5px 5px auto;
                    }
                    .animPreviewSwipeButton:last-child {
                        margin: 5px auto 5px 5px;
                    }

                    .animPreviewSwipeButton.enabled {
                        color: white;
                        background-color: var(--brand-experiment);
                    }

                    .animPreview.enabled {
                        background-color: var(--brand-experiment);
                    }

                    .animPreview.enabled .animTempBlock {
                        background-color: #fff;
                    }
                    
                    .animPreview.enabled .animPreviewLabel {
                        color: #fff;
                    }`

                    PluginUtilities.removeStyle('Animations-req');
                    setTimeout(() => {
                        PluginUtilities.addStyle('Animations-req', this.reqStyles)
                    }, 100);
                    this.changeStyles()
                }

                stop() {

                    PluginUtilities.removeStyle('Animations-main');
                    PluginUtilities.removeStyle('Animations-req');
                    PluginUtilities.removeStyle('Animations-count');

                }

            }

        };
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();