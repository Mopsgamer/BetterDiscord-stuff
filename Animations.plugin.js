/**
 * @name Animations
 * @version 1.2.7.1
 * @description This plugin is designed to animate different objects (lists, buttons, panels, etc.) with the ability to set delays, durations, types and sequences of these animations.
 * @author Mops
 * @authorLink https://github.com/Mopsgamer/
 * @authorId 538010208023347200
 * @website https://github.com/Mopsgamer/BetterDiscord-codes/tree/Animations
 * @source https://raw.githubusercontent.com/Mopsgamer/BetterDiscord-codes/Animations/Animations.plugin.js
 * @updateUrl https://raw.githubusercontent.com/Mopsgamer/BetterDiscord-codes/Animations/Animations.plugin.js
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
            version: '1.2.7.1',
            description: 'This plugin is designed to animate different objects (lists, buttons, panels, etc.) with the ability to set delays, durations, types and sequences of these animations.',
            github: 'https://github.com/Mopsgamer/Animations/blob/main/Animations.plugin.js',
            github_raw: 'https://raw.githubusercontent.com/Mopsgamer/Animations/main/Animations.plugin.js',
        },
        changelog: [
            { "title": "New Stuff", "items": ["Added selector settings for lists and buttons.", "The \"Rebuild animations\" button."] },
            { "title": "Improvements", "type": "improved", "items": ["The editor has been improved.", "Now the default animation is opacity."] },
            { "title": "Fixes", "type": "fixed", "items": ["Sometimes missing animations."] }
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
                { DiscordSelectors, DiscordAPI, PluginUtilities, PluginUpdater, DOMTools, Modals, WebpackModules } = Api,
                { Logger, Patcher, Settings, Tooltip, ReactComponents } = Library;

            return class Animations extends Plugin {

                constructor() {
                    super();

                    this.defaultSettings = {
                        lists: {
                            enabled: true,
                            name: 'opacity',
                            page: 0,
                            sequence: 'fromFirst',
                            selectors: '',
                            custom: {
                                enabled: false,
                                frames: ['', '', '', ''],
                                page: 0
                            },
                            duration: 0.3,
                            delay: 0.04,
                            limit: 65
                        },
                        messages: {
                            enabled: true,
                            name: 'opacity',
                            page: 0,
                            custom: {
                                enabled: false,
                                frames: ['', '', '', ''],
                                page: 0
                            },
                            duration: 0.4,
                            delay: 0.04,
                            limit: 30
                        },
                        buttons: {
                            enabled: true,
                            name: 'opacity',
                            page: 0,
                            sequence: 'fromLast',
                            selectors: '',
                            custom: {
                                enabled: false,
                                frames: ['', '', '', ''],
                                page: 0
                            },
                            duration: 0.3,
                            delay: 0.2
                        }
                    }

                    this.settings = PluginUtilities.loadSettings("Animations", this.defaultSettings);
                }

                getName() { return config.info.name }
                getAuthor() { return config.info.authors.map(a => a.name).join(' / ') }
                getDescription() { return config.info.description }
                getVersion() { return config.info.version }

                colors = {
                    red: '#ed4245',
                    green: '#3ba55d',
                    yellow: '#faa81a'
                }

                static selectorsLists = [
                    /*active threads button*/
                    '.wrapper-NhbLHG',
                    /*threads button > list*/
                    '.container-2rzKKA',
                    /*search*/
                    '.searchResultGroup-1lU_-i',
                    /*members*/
                    '.member-2gU6Ar:not(.placeholder-1WgmVn)',
                    /*member-groups*/
                    'h2.membersGroup-2eiWxl',
                    /*servers*/
                    '#app-mount .guilds-2JjMmN [class*="listItem"]:not([class*="listItemWrapper"])',
                    /*friends*/
                    '.peopleListItem-u6dGxF',
                    /*channels*/
                    '.channel-1Shao0',
                    '.privateChannelsHeaderContainer-1UWASm',
                    /*discovery categories*/
                    '.categoryItem-Kc_HK_',
                    /*discord settings list*/
                    '.side-2ur1Qk *',
                    /*discord settings*/
                    'main.contentColumnDefault-3eyv5o > div:not(#bd-editor-panel):not(.bd-controls):not(.bd-empty-image-container):not(.bd-addon-list):not(.bd-settings-group) > div:first-child > *:not(.image-141SOA)',
                    'main.contentColumnDefault-3eyv5o > div:not(#bd-editor-panel):not(.bd-controls):not(.bd-empty-image-container):not(.bd-addon-list):not(.bd-settings-group) > div:not(.bd-settings-group):not(:first-child)',
                    'main.contentColumnDefault-3eyv5o > div:not(#bd-editor-panel):not(.bd-controls):not(.bd-empty-image-container):not(.bd-addon-list):not(.bd-settings-group) > h2',
                    '.bd-addon-card',
                    /*alert elements*/
                    '.focusLock-2tveLW .scrollerBase-_bVAAt:not(.bd-addon-modal-settings) > div',
                    '.templatesList-uohY49 > *',
                    /*public servers*/
                    '.guildList-3GXKvP > .loaded-igpmmx'
                ]

                static selectorsButtons = [
                    /*chat input buttons*/
                    '.actionButtons-2vEOUh button',
                    /*voice opened buttons*/
                    '.buttons-uaqb-5 > *',
                    /*toolbar*/
                    '.toolbar-3_r2xA > *',
                    '.children-3xh0VB > *',
                    '.tabBar-ra-EuL > .item-3mHhwr'
                ]

                static names = [
                    'opacity',
                    'slime',
                    'brick-right',
                    'brick-left',
                    'brick-up',
                    'brick-down',
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
                    'skew-left',
                    'wide-skew-right',
                    'wide-skew-left',
                ]

                static sequences = [
                    'fromFirst',
                    'fromLast',
                ]

                get countStyles() {
                    let result = '';

                    ;((this.isValidSelector(this.settings.lists.selectors)&&this.settings.lists.selectors.trim()!='')?this.settings.lists.selectors.split(",").map(item => item.trim()):Animations.selectorsLists)
                    .forEach((selector, i) => { if(!this.settings.lists.enabled) return;

                        let count = this.settings.lists.limit;

                        if (this.settings.lists.sequence == 'fromFirst') for (var i = 1; i < count + 1; i++) {
                            result += `${selector}:nth-child(${i}) `
                                + `{animation-delay: ${((i - 1) * this.settings.lists.delay).toFixed(2)}s}\n\n`
                        }
                        if (this.settings.lists.sequence == 'fromLast') for (var i = 1; i < count + 1; i++) {
                            result += `${selector}:nth-last-child(${i}) `
                                + `{animation-delay: ${((i - 1) * this.settings.lists.delay).toFixed(2)}s}\n\n`
                        }
                    
                    })

                    ;((this.isValidSelector(this.settings.buttons.selectors)&&this.settings.buttons.selectors.trim()!='')?this.settings.buttons.selectors.split(",").map(item => item.trim()):Animations.selectorsButtons)
                    .forEach(selector => { if(!this.settings.buttons.enabled) return;

                        let count = 20;

                        if (this.settings.buttons.sequence == 'fromFirst') for (var i = 1; i < count + 1; i++) {
                            result += `${selector}:nth-child(${i}) `
                                + `{animation-delay: ${((i - 1) * this.settings.buttons.delay).toFixed(2)}s}\n\n`
                        }
                        if (this.settings.buttons.sequence == 'fromLast') for (var i = 1; i < count + 1; i++) {
                            result += `${selector}:nth-last-child(${i}) `
                                + `{animation-delay: ${((i - 1) * this.settings.buttons.delay).toFixed(2)}s}\n\n`
                        }

                    })

                    return result;

                }

                threadsWithChannels = (removeAnimations = false)=>{
                    if(!this.settings.lists.enabled) return
                    var channelsListElements = document.querySelectorAll('#channels .content-2a4AW9 > [class]');
                    var count = this.settings.messages.limit

                    for (var i = 0, threadsCount = 0; i < count; i++) {
                        let children = channelsListElements[(this.settings.lists.sequence=="fromFirst"?i:count-i-1)];
                        if(!children) return;
                        
                        if (children.classList.contains('containerDefault-YUSmu3')
                         || children.classList.contains('containerDefault-3TQ5YN')
                         || children.classList.contains('wrapper-NhbLHG')
                        ) {
                            if(removeAnimations) {
                                children.style.transform = 'none'
                            }
                            else {
                                children.style.animationDelay = `${((i+threadsCount) * this.settings.lists.delay).toFixed(2)}s`;
                                children.style.animationName = this.settings.lists.custom.enabled &&
                                                            this.settings.lists.custom.frames[this.settings.lists.custom.page].trim() != '' &&
                                                            this.isValidCSS(this.settings.lists.custom.frames[this.settings.lists.custom.page])
                                                            ? 'custom-lists' : this.settings.lists.name;
                            }
                        }

                        else if (children.classList.contains('container-1Bj0eq')) {
                            var threadsForkElement = children.querySelector('.container-1Bj0eq > svg');
                            var threadsListElements = children.querySelectorAll('.containerDefault-YUSmu3');

                            threadsForkElement.style.animationDelay = `${((i+threadsCount) * this.settings.lists.delay).toFixed(2)}s`;
                            threadsForkElement.style.animationName = 'slide-right';

                            for (var j = 0; j < threadsListElements.length; j++) {
                                threadsCount += (j?1:0);
                                let thread = threadsListElements[(this.settings.lists.sequence=="fromFirst"?j:threadsListElements.length-j-1)];
                                if(removeAnimations) {
                                    thread.style.transform = 'none'
                                }
                                else {
                                    thread.style.animationDelay = `${((i+threadsCount) * this.settings.lists.delay).toFixed(2)}s`;
                                    thread.style.animationName = this.settings.lists.custom.enabled && this.settings.lists.custom.frames[this.settings.lists.custom.page].trim() != '' ? 'custom-lists' : this.settings.lists.name;
                                }
                            }
                        }
                        
                    }
                }

                changeStyles(delay=0) {

                    var createKeyFrame = function(name, originalName, rotate=0, opacity=1) {
                        var keyframes = {
                            "in":
                            `@keyframes ${name} {
                                0% {
                                    transform-origin: 50%;
                                    transform: scale(1.3) rotate(${rotate}deg);
                                    opacity: 0;
                                }
                                100% {
                                    transform-origin: 50%;
                                    transform: scale(1) rotate(${rotate}deg);
                                    opacity: ${opacity};
                                }
                            }`,
                            "out":
                            `@keyframes ${name} {
                                0% {
                                    transform-origin: 50%;
                                    transform: scale(0.7) rotate(${rotate}deg);
                                    opacity: 0;
                                }
                                100% {
                                    transform-origin: 50%;
                                    transform: scale(1) rotate(${rotate}deg);
                                    opacity: ${opacity};
                                }
                            }`,
                            "opacity":
                            `@keyframes ${name} {
                                0% {
                                    transform-origin: 50%;
                                    transform: scale(1) rotate(${rotate}deg);
                                    opacity: 0;
                                }
                                100% {
                                    transform-origin: 50%;
                                    transform: scale(1) rotate(${rotate}deg);
                                    opacity: ${opacity};
                                }
                            }`,
                            "slime":
                            `@keyframes ${name} {
                                0% {
                                    transform-origin: 50%;
                                    transform: scale(1) rotate(${rotate}deg);
                                    opacity: 0;
                                }
                                25% {
                                    transform-origin: 50%;
                                    transform: scale(1.3, 0.7) rotate(${rotate}deg);
                                    opacity: ${opacity};
                                }
                                50% {
                                    transform-origin: 50%;
                                    transform: scale(0.8, 1.2) rotate(${rotate}deg);
                                    opacity: ${opacity};
                                }
                                75% {
                                    transform-origin: 50%;
                                    transform: scale(1.1, 0.9) rotate(${rotate}deg);
                                    opacity: ${opacity};
                                }
                                100% {
                                    transform-origin: 50%;
                                    transform: scale(1) rotate(${rotate}deg);
                                    opacity: ${opacity};
                                }
                            }`,
                            "brick-up":
                            `@keyframes ${name} {
                                0% {
                                    transform-origin: 50%;
                                    transform: scale(1) translate(0, 500%) rotate(${rotate}deg);
                                    opacity: 0;
                                }
                                100% {
                                    transform-origin: 50%;
                                    transform: scale(1) translate(0, 0) rotate(${rotate}deg);
                                    opacity: ${opacity};
                                }
                            }`,
                            "brick-right":
                            `@keyframes ${name} {
                                0% {
                                    transform-origin: 50%;
                                    transform: scale(1) translate(-500%, 0) rotate(${rotate}deg);
                                    opacity: 0;
                                }
                                100% {
                                    transform-origin: 50%;
                                    transform: scale(1) translate(0, 0) rotate(${rotate}deg);
                                    opacity: ${opacity};
                                }
                            }`,
                            "brick-left":
                            `@keyframes ${name} {
                                0% {
                                    transform-origin: 50%;
                                    transform: scale(1) translate(500%, 0) rotate(${rotate}deg);
                                    opacity: 0;
                                }
                                100% {
                                    transform-origin: 50%;
                                    transform: scale(1) translate(0, 0) rotate(${rotate}deg);
                                    opacity: ${opacity};
                                }
                            }`,
                            "brick-down":
                            `@keyframes ${name} {
                                0% {
                                    transform-origin: 50%;
                                    transform: scale(1) translate(0, -500%) rotate(${rotate}deg);
                                    opacity: 0;
                                }
                                100% {
                                    transform-origin: 50%;
                                    transform: scale(1) translate(0, 0) rotate(${rotate}deg);
                                    opacity: ${opacity};
                                }
                            }`,
                            "slide-right":
                            `@keyframes ${name} {
                                0% {
                                    transform-origin: 0% 50%;
                                    transform: scaleX(0) rotate(${rotate}deg);
                                }
                                100% {
                                    transform-origin: ${rotate!=90?'0% 50%':'50%'};
                                    transform: scale(1) translate(0) rotate(${rotate}deg);
                                }
                            }`,
                            "slide-left":
                            `@keyframes ${name} {
                                0% {
                                    transform-origin: 100% 50%;
                                    transform: scaleX(0) rotate(${rotate}deg);
                                }
                                100% {
                                    transform-origin: ${rotate!=90?'100% 50%':'50%'};
                                    transform: scale(1) translate(0) rotate(${rotate}deg);
                                }
                            }`,
                            "slide-up":
                            `@keyframes ${name} {
                                0% {
                                    transform-origin: 50% 100%;
                                    transform: scaleY(0) rotate(${rotate}deg);
                                }
                                100% {
                                    transform-origin: ${rotate!=90?'50% 100%':'50%'};
                                    transform: scale(1) translate(0) rotate(${rotate}deg);
                                }
                            }`,
                            "slide-down":
                            `@keyframes ${name} {
                                0% {
                                    transform-origin: 50% 0%;
                                    transform: scaleY(0) rotate(${rotate}deg);
                                }
                                100% {
                                    transform-origin: ${rotate!=90?'50% 0%':'50%'};
                                    transform: scale(1) translate(0) rotate(${rotate}deg);
                                }
                            }`,
                            "slide-up-right":
                            `@keyframes ${name} {
                                0% {
                                    transform-origin: 0% 100%;
                                    transform: scale(0) rotate(${rotate}deg);
                                }
                                100% {
                                    transform-origin: ${rotate!=90?'0% 100%':'50%'};
                                    transform: scale(1) rotate(${rotate}deg) translate(0);
                                }
                            }`,
                            "slide-up-left":
                            `@keyframes ${name} {
                                0% {
                                    transform-origin: 100%;
                                    transform: scale(0) rotate(${rotate}deg);
                                }
                                100% {
                                    transform-origin: ${rotate!=90?'100%':'50%'};
                                    transform: scale(1) rotate(${rotate}deg) translate(0);
                                }
                            }`,
                            "slide-down-right":
                            `@keyframes ${name} {
                                0% {
                                    transform-origin: 0%;
                                    transform: scale(0) rotate(${rotate}deg);
                                }
                                100% {
                                    transform-origin: ${rotate!=90?'0%':'50%'};
                                    transform: scale(1) rotate(${rotate}deg) translate(0);
                                }
                            }`,
                            "slide-down-left":
                            `@keyframes ${name} {
                                0% {
                                    transform-origin: 100% 0%;
                                    transform: scale(0) rotate(${rotate}deg);
                                }
                                100% {
                                    transform-origin: ${rotate!=90?'100% 0%':'50%'};
                                    transform: scale(1) rotate(${rotate}deg) translate(0);
                                }
                            }`,
                            "skew-right":
                            `@keyframes ${name} {
                                0% {
                                    transform-origin: 50%;
                                    transform: skewX(-30deg) scale(1) rotate(${rotate}deg);
                                    opacity: 0;
                                }
                                100% {
                                    transform-origin: 50%;
                                    transform: skewX(0) scale(1) rotate(${rotate}deg);
                                    opacity: ${opacity};
                                }
                            }`,
                            "skew-left":
                            `@keyframes ${name} {
                                0% {
                                    transform-origin: 50%;
                                    transform: skewX(30deg) scale(1) rotate(${rotate}deg);
                                    opacity: 0;
                                }
                                100% {
                                    transform-origin: 50%;
                                    transform: skewX(0) scale(1) rotate(${rotate}deg);
                                    opacity: ${opacity};
                                }
                            }`,
                            "wide-skew-right":
                            `@keyframes ${name} {
                                0% {
                                    transform-origin: 50%;
                                    transform: skewY(15deg) scale(1) rotate(${rotate}deg);
                                    opacity: 0;
                                }
                                100% {
                                    transform-origin: 50%;
                                    transform: skew(0) scale(1) rotate(${rotate}deg);
                                    opacity: ${opacity};
                                }
                            }`,
                            "wide-skew-left":
                            `@keyframes ${name} {
                                0% {
                                    transform-origin: 50%;
                                    transform: skewY(-15deg) scale(1) rotate(${rotate}deg);
                                    opacity: 0;
                                }
                                100% {
                                    transform-origin: 50%;
                                    transform: skew(0) scale(1) rotate(${rotate}deg);
                                    opacity: ${opacity};
                                }
                            }`
                        }

                        return keyframes[originalName]
                        
                    }

                    var keyframes = (()=>{
                        var result = '';

                        Animations.names.forEach(
                            animName=>{
                                result+=`
                                ${createKeyFrame(animName, animName, 0)}\n
                                ${createKeyFrame(`${animName}_offline`, animName, 0, 0.3)}\n
                                ${createKeyFrame(`${animName}_90`, animName, 90)}\n
                                `
                            }
                        )

                        return result
                    })()

                    let animPrevStyles = (() => {
                        let result = '';

                        ;(["lists", "messages", "buttons"]).forEach(type=>{
                            if (!Animations.names.includes(this.settings[type].name)) {
                                this.settings[type].name = this.defaultSettings[type].name;
                                PluginUtilities.saveSettings("Animations", this.settings);
                            }
                        });

                        ;(["lists", "buttons"]).forEach(type=>{
                            if (!Animations.sequences.includes(this.settings[type].sequence)) {
                                this.settings[type].sequence = this.defaultSettings[type].sequence;
                                PluginUtilities.saveSettings("Animations", this.settings);
                            }
                        });

                        Animations.names.forEach(animName => {
                            for (var i = 1; i < 5; i++) {
                                result += `.animPreview[data-animation="${animName}"]:hover > .animTempBlock:nth-child(${i})`
                                    + ` {transform: scale(0); animation-name: ${animName}; animation-fill-mode: forwards; animation-duration: 0.3s; animation-delay: ${(i - 1) * 0.06}s;}\n`
                            }
                        })

                        return result;
                    })()

                    let nthStyles = (() => {
                        let result = '';

                        result += `.animPreview:hover .animTempBlock {animation-name: out; animation-duration: 0.3s;}\n\n`;
                        for (var i = 1; i < 4+1+1; i++) {
                            result += `[data-animation="fromFirst"] .animTempBlock:nth-child(${i})
                            {animation-delay:${((i - 1) * 0.06).toFixed(2)}s}\n\n`
                        }
                        for (var i = 1; i < 4+1+1; i++) {
                            result += `[data-animation="fromLast"] .animTempBlock:nth-last-child(${i})
                            {animation-delay:${((i - 1) * 0.06).toFixed(2)}s}\n\n`
                        }

                        for (var i = 1; i < this.settings.messages.limit; i++) {
                            result += `.messageListItem-ZZ7v6g:nth-last-child(${i}) > .message-2CShn3
                            {animation-delay:${((i - 1) * this.settings.messages.delay).toFixed(2)}s}\n`
                        }

                        return result;
                    })()

                    this.styles = `
                /*ANIMATED DISCORD*/

                /*lists limit*/
                .side-2ur1Qk > :nth-child(n+${this.settings.lists.limit}),
                .content-2a4AW9 > :nth-child(n+${this.settings.lists.limit})
                {animation: none !important; transform: none !important}

                ${!this.settings.lists.enabled ? '' : `
                /* wawes */
                /*channels*/
                .containerDefault-3TQ5YN,
                .containerDefault-YUSmu3
                {
                    transform: scaleX(0);
                    animation-fill-mode: forwards;
                    animation-duration: ${this.settings.lists.duration}s;
                }

                /* members offline */
                .offline-22aM7E
                {
                    animation-name: ${this.settings.lists.name}_offline !important;
                }

                ${this.settings.lists.selectors?this.settings.lists.selectors:Animations.selectorsLists.join(', ')}
                {
                    transform: scaleX(0);
                    animation-name: ${this.settings.lists.custom.enabled &&
                                    this.settings.lists.custom.frames[this.settings.lists.custom.page].trim() != '' &&
                                    this.isValidCSS(this.settings.lists.custom.frames[this.settings.lists.custom.page])
                                    ? 'custom-lists' : this.settings.lists.name};
                    animation-fill-mode: forwards;
                    animation-duration: ${this.settings.lists.duration}s;
                }

                ${!BdApi.Themes.isEnabled('Horizontal Server List')? '' : `
                #app-mount .guilds-2JjMmN [class*=listItem]:not([class*=listItemWrapper]) {
                    transform: scaleX(0) rotate(90deg);
                    animation-name: ${this.settings.lists.name}_90;
                }
                `}
                `}

                ${!this.settings.messages.enabled ? '' : `
                /* messages */
                .messageListItem-ZZ7v6g > .message-2CShn3
                {
                    transform: scale(0);
                    animation-fill-mode: forwards;
                    animation-name: ${this.settings.messages.custom.enabled &&
                                    this.settings.messages.custom.frames[this.settings.messages.custom.page].trim() != '' &&
                                    this.isValidCSS(this.settings.messages.custom.frames[this.settings.messages.custom.page])
                                    ? 'custom-messages' : this.settings.messages.name};
                    animation-duration: ${this.settings.messages.duration}s;
                }

                /*lines-forward-messages fix*/
                .divider-IqmEqJ {z-index: 0}
                `}

                ${!this.settings.buttons.enabled ? '' : `
                ${this.settings.buttons.selectors?this.settings.buttons.selectors:Animations.selectorsButtons.join(', ')}
                {
                    transform: scaleX(0);
                    animation-name: ${this.settings.buttons.custom.enabled &&
                                    this.settings.buttons.custom.frames[this.settings.buttons.custom.page].trim() != '' &&
                                    this.isValidCSS(this.settings.buttons.custom.frames[this.settings.buttons.custom.page])
                                    ? 'custom-buttons' : this.settings.buttons.name};
                    animation-fill-mode: forwards;
                    animation-duration: ${this.settings.buttons.duration}s;
                }
                `}

                /**Non-custom**/

                /*threads fork*/
                .container-1Bj0eq > svg {
                    transform: scale(0);
                    transform-oringin: 100% 50%;
                    animation-timing-function: linear;
                    animation-duration: ${this.settings.lists.duration}s;
                    animation-fill-mode: forwards;
                }

                /*discord changelog video*/
                .video-8B-TdZ {
                    animation-name: out !important;
                }

                /**Keyframes**/

                ${keyframes}

                \n${animPrevStyles}
                \n${nthStyles}

                /*Custom keyframes*/
                
                @keyframes custom-lists {
                    ${this.settings.lists.custom.frames[this.settings.lists.custom.page]}
                }

                @keyframes custom-messages {
                    ${this.settings.messages.custom.frames[this.settings.messages.custom.page]}
                }

                @keyframes custom-buttons {
                    ${this.settings.buttons.custom.frames[this.settings.buttons.custom.page]}
                }
                `;

                    PluginUtilities.removeStyle('Animations-main');
                    PluginUtilities.removeStyle('Animations-count');
                    
                    setTimeout(()=>{
                        PluginUtilities.addStyle('Animations-main', this.styles);
                        PluginUtilities.addStyle('Animations-count', this.countStyles);
                        this.threadsWithChannels();
                    }, delay)
                }

                closeSettings() {
                    document.querySelector('.bd-addon-modal-footer > .bd-button').click()
                }

                isValidCSS(text){
                    if(text.trim()=='') return false;
                    var id = 'CSSValidChecker';
                    var css = `@keyframes KEYFRAME_VALIDATOR {\n${text}\n}`
                    BdApi.injectCSS(id, css)
                    var isValid = document.querySelector("head > bd-head > bd-styles > #" + id).sheet.rules[0]?.cssText.replace(/;| |\n/g, "") === css.replace(/;| |\n/g, "")
                    BdApi.clearCSS(id)
                    return isValid
                }

                isValidSelector(text) {
                    try{
                        document.querySelectorAll(text)
                    } catch {return false}
                    return true
                }

                getSettingsPanel() {

                    var ElementButton = (button) => {

                        return BdApi.React.createElement('button', {
                            style: {
                                display: 'inline-block',
                                width: button.width ?? 'fit-content',
                                height: button.height ?? 'fit-content',
                                padding: button.padding ?? '8px',
                                margin: button.margin ?? '8px',
                                'transition': 'background-color .17s ease, color .17s ease, opacity 250ms ease',
                            },
                            id: button.id,
                            class: `button-f2h6uQ sizeSmall-wU2dO- ${button.inverted ? 'inverted' : 'filled'} ${button.color ?? 'blurple'} ${button.class ?? ''}`,
                            onClick: button.onclick ?? null
                        },
                            BdApi.React.createElement('div', {
                                style: {
                                    'pointer-events': 'none',
                                    'display': 'flex',
                                    'align-items': 'center',
                                    'justify-content': 'center'
                                }
                            },
                                [
                                    button.svgPath ? BdApi.React.createElement('svg',
                                        {
                                            viewBox: button.svgView ?? '0 0 24 24',
                                            fill: '#fff',
                                            style: {
                                                width: '18px',
                                                height: '18px',
                                                'margin-right': '4px'
                                            }
                                        },
                                        BdApi.React.createElement('path', { d: button.svgPath })
                                    ) : null,
                                    BdApi.React.createElement('span', {
                                        class: 'buttonText-1c-l_x',
                                    },
                                        button.label
                                    )
                                ]
                            )
                        )
                    }

                    /**
                     * Returns object - `class`, `render`.
                     * @param {Array<object>} containersTemp Array with button container templates.
                     * @param {object} options Panel optinons.
                     * @param {string} [options.widthAll] The width of each button, if the template does not specify a different width.
                     * @param {string} [options.heightAll] The height of each button, if the template does not specify a different height.
                     * @param {string} [options.align="inline-flex"] `justify-content` css value for each button container. Default - `flex-start`.
                     */

                    var ButtonsPanel = (containersTemp = [], options = {}) => {
                        var containerNodes = [];
                        containersTemp.forEach(containerTemp=>{
                            var buttonNodes = [];
                            containerTemp.buttons.forEach(buttonTemp=>{
                                buttonNodes.push(
                                    ElementButton({
                                        width: options.widthAll ?? containerTemp.options?.widthAll,
                                        height: options.heightAll ?? containerTemp.options?.heightAll,
                                        ...buttonTemp
                                    })
                                )
                            })
                            containerNodes.push(
                                BdApi.React.createElement('div',
                                    {
                                        style: {
                                            display: 'inline-flex',
                                            width: '100%',
                                            'justify-content': options.align ?? containerTemp.options?.align ?? 'flex-start'
                                        },
                                        class: `buttonsContainer`
                                    },
                                    ...buttonNodes
                                )
                            )
                        })

                        var result = BdApi.React.createElement('div', {
                            style: {
                                display: 'flex',
                                width: '100%',
                                'flex-direction': 'column',
                                'justify-content': options.align ?? 'inline-flex'
                            },
                            class: `buttonsPanel`
                        },
                            [
                                ...containerNodes
                            ]
                        )

                        class Panel extends BdApi.React.Component {
                            render() {
                                return result
                            }
                        }

                        return {class: Panel, render: result};
                    }

                    /**
                     * Returns object - `class`, `render`.
                     * @param {object} options Textarea options.
                     * @param {string} [options.height] Textarea height.
                     * @param {string} [options.type='text'] Input type: `button`, `checkbox`, `file`, `hidden`, `image`, `password`, `radio`, `reset`, `submit` or `text`. Default - `text`.
                     * @param {string} [options.placeholder] Hint text.
                     * @param {object} [options.buttonsPanel] ButtonsPanel.
                     * @param {Array<object>} [options.buttonsPanel.containersTemp] Array with button container templates.
                     * @param {object} [options.buttonsPanel.options] ButtonsPanel options.
                     * @param {string} [options.buttonsPanel.options.widthAll] The width of each button, if the template does not specify a different width.
                     * @param {string} [options.buttonsPanel.options.heightAll] The height of each button, if the template does not specify a different height.
                     * @param {string} [options.buttonsPanel.options.align="inline-flex"] `justify-content` css value for each button container. Default - `flex-start`.
                     * @param {string} [options.class]
                     * @param {(e:InputEvent)=>void} onchange Event at each change.
                     * @param {string} value
                     */

                    var TextareaPanel = (options={}, value, onchange) => {
                        var result = BdApi.React.createElement('div', {
                            style: {
                                margin: options.margin ?? null,
                                padding: options.padding ?? null
                            },
                            class: `animTextareaPanel ${options.class}`
                        },
                            [
                                options.buttonsPanel?(ButtonsPanel(options.buttonsPanel.containersTemp, options.buttonsPanel.options ?? {}).render):null,
                                BdApi.React.createElement('textarea',
                                    {
                                        style: {
                                            height: options?.textarea?.height ?? '270px',
                                            width: options?.textarea?.width ?? '100%'
                                        },
                                        spellcheck: 'false',
                                        type: options.textarea?.type ?? 'text',
                                        placeholder: options.textarea?.placeholder ?? '',
                                        class: `animTextarea ${options.textarea?.class ?? ''} inputDefault-3FGxgL input-2g-os5 textArea-3WXAeD scrollbarDefault-2w-Dyz scrollbar-3vVt8d`,
                                        onChange: onchange ?? null
                                    },
                                    value
                                )
                            ]
                        )

                        class Panel extends BdApi.React.Component {
                            render() {
                                return result
                            }
                        }

                        return {class: Panel, render: result}
                    }

                    /**
                     * Returns object - `class`, `render`.
                     * @param {Array<object>} previewsTemp Array with previews templates.
                     * @param {object} options Panel optinons.
                     * @param {string} [options.type] `*class*-name`, `*class*-sequence`, ...
                     * @param {string} [options.class] `lists`, `messages`, `buttons`
                     * @param {(e:MouseEvent)=>void} [onclick]
                     * @param {string} value
                     */

                    var PreviewsPanel = (previewsTemp = [], options = {}, value, onclick) => {

                        var swipeButtonsDefault = [];
                        var swipeButtonsCustom = [];
                        var previews = [];
                        var containers = [];
                        var textareas = [];
                        var openedPage = 0;
                        var containersCount = 0;
                        var previewsCountOnPage = (options.horizontal ? 6 : 8);

                        if(options.custom)
                        if(this.settings[options.class].custom.enabled)
                        if(!this.isValidCSS(this.settings[options.class].custom.frames[this.settings[options.class].custom.page]))
                        {
                            this.settings[options.class].custom.enabled = false;
                            PluginUtilities.saveSettings("Animations", this.settings);
                        }

                        previewsTemp.forEach((template, index) => {
                            if (value == template.value) openedPage = Math.ceil((index + 1) / previewsCountOnPage)-1;
                            var tempBlocks = []
                            for (var i = 0; i < 4; i++) {
                                tempBlocks[i] = BdApi.React.createElement('div', {
                                    class: 'animTempBlock'
                                })
                            }

                            previews.push(
                                BdApi.React.createElement('div', {
                                    'data-animation': template.value,
                                    class: `animPreview ${value == template.value ? 'enabled' : ''}`,
                                    onClick: (e) => {
                                        onclick({value: template.value, page: openedPage});

                                        var sections = document.querySelectorAll(`[data-type="${options.type}"] .animPreview`);
                                        for (i = 0; i < sections.length; i++) sections[i].classList.remove('enabled');
                                        e.currentTarget.classList.add('enabled');
                                    }
                                },
                                    [...tempBlocks, BdApi.React.createElement('div', {
                                        class: 'animPreviewLabel',
                                        title: template.label
                                    }, template.label
                                    )]
                                )
                            )
                        })

                        for (containersCount = 0; containersCount + 1 <= Math.ceil(previewsTemp.length / previewsCountOnPage); containersCount++) {
                            swipeButtonsDefault.push(
                                BdApi.React.createElement('div',
                                    {
                                        class: `animPageCircleButton ${openedPage == containersCount ? 'enabled' : ''}`,
                                        'data-page': containersCount,
                                        onClick: (e) => {
                                            for (var containerElem of e.currentTarget.closest('.animPreviewsPanel').querySelectorAll(`.animPreviewsContainer, .customKeyframeTextArea`)) containerElem.classList.remove('show');

                                            e.currentTarget.closest('.animPreviewsPanel').querySelectorAll(`.animPreviewsContainer`)[e.currentTarget.getAttribute('data-page')].classList.add('show');

                                            var sections = document.querySelectorAll(`[data-type="${options.type}"] .default .animPageCircleButton`);
                                            for (i = 0; i < sections.length; i++) sections[i].classList.remove('enabled');

                                            e.currentTarget.classList.add('enabled');

                                            this.settings[options.class].page = Number(e.currentTarget.getAttribute('data-page'));
                                        }
                                    },
                                    containersCount + 1
                                )
                            );

                            var pages = [];

                            var i = 0;
                            while (i < previewsCountOnPage) {
                                pages.push(previews[(containersCount) * previewsCountOnPage + i])
                                i++
                            }

                            containers.push(
                                BdApi.React.createElement('div',
                                    {
                                        class: `animPreviewsContainer ${(options.custom) ? (!this.settings[options.class].custom.enabled && openedPage == containersCount ? 'show' : '') : (openedPage == containersCount ? 'show' : '')} ${previewsTemp.length < previewsCountOnPage + 1 ? 'compact' : ''}`,
                                    },
                                    pages
                                )
                            );

                        }

                        if (options.custom) {

                            for (var i = 0; i < 4; i++) {
                                textareas.push(
                                    TextareaPanel(
                                        {
                                            buttonsPanel: {
                                                containersTemp: [
                                                    {
                                                        buttons: [
                                                            {
                                                                label: 'Template',
                                                                onclick: (e) => {
                                                                    e.currentTarget.closest('.animTextareaPanel')
                                                                    .querySelector('.animTextarea').value = `0% {\n\ttransform: translate(0, 100%);\n}\n\n100% {\n\ttransform: translate(0, 0) scale(1);\n}`;
                                                                }
                                                            },
                                                            {
                                                                label: 'Clear',
                                                                onclick: (e) => {
                                                                    var textarea = e.currentTarget.closest('.animTextareaPanel').querySelector('.animTextarea')
                                                                    textarea.value = '';
                                                                    textarea.focus();
                                                                }
                                                            },
                                                            {
                                                                color: 'green',
                                                                label: 'Load',
                                                                onclick: (e) => {
                                                                    e.currentTarget.closest('.animTextareaPanel')
                                                                    .querySelector('.animTextarea').value = this.settings[options.class].custom.frames[this.settings[options.class].custom.page]
                                                                }
                                                            },
                                                            {
                                                                color: 'green',
                                                                label: 'Save',
                                                                onclick: (e) => {
                                                                    this.settings[options.class].custom.frames[this.settings[options.class].custom.page] = e.currentTarget.closest('.animTextareaPanel')
                                                                    .querySelector('.animTextarea').value;
                                                                    PluginUtilities.saveSettings("Animations", this.settings);
                                                                    this.changeStyles()
                                                                }
                                                            },
                                                        ]
                                                    }
                                                ],
                                                options: {
                                                    widthAll: '100%'
                                                }
                                            },
                                            textarea: {
                                                height: '281px',
                                                placeholder: '/*\nAnimated elements have scale(0) in the transformation,\nso your animation must contain scale(1) on the final frame(100%).\n*/\n\n0% {\n\ttransform: translate(0, 100%);\n}\n\n100% {\n\ttransform: translate(0, 0) scale(1);\n}',
                                            },
                                            class: `${this.settings[options.class].custom.enabled && i == this.settings[options.class].custom.page ? 'show' : ''}`,
                                        },
                                        options.custom.data.frames[i],
                                        (e) => {
                                            var textarea = e.currentTarget;
                                            var value = e.currentTarget.value;
                                            if (this.isValidCSS(value) || value == "") {
                                                textarea.classList.add('valid');
                                                textarea.classList.remove('invalid');
                                            } else {
                                                textarea.classList.add('invalid');
                                                textarea.classList.remove('valid');
                                            }

                                            options.custom?.onchange(e)
                                        }
                                    ).render
                                );

                                swipeButtonsCustom.push(
                                    BdApi.React.createElement('div',
                                        {
                                            class: `animPageCircleButton ${this.settings[options.class].custom.page == i ? 'enabled' : ''}`,
                                            'data-page': i,
                                            onClick: (e) => {
                                                for (var containerElem of e.currentTarget.closest('.animPreviewsPanel').querySelectorAll(`.animPreviewsContainer, .animTextareaPanel`)) containerElem.classList.remove('show');

                                                e.currentTarget.closest('.animPreviewsPanel').querySelectorAll(`.animTextareaPanel`)[e.currentTarget.getAttribute('data-page')].classList.add('show');

                                                var sections = document.querySelectorAll(`[data-type="${options.type}"] .custom .animPageCircleButton`);
                                                for (i = 0; i < sections.length; i++) sections[i].classList.remove('enabled');

                                                e.currentTarget.classList.add('enabled');

                                                this.settings[options.class].custom.page = Number(e.currentTarget.getAttribute('data-page'));
                                            }
                                        },
                                        i + 1
                                    )
                                );
                            };


                        }

                        var result = BdApi.React.createElement('div',
                            {
                                class: `animPreviewsPanel ${options.horizontal ? 'horizontal' : 'vertical'}`,
                                'data-type': options.type
                            },
                            [
                                options.custom ? BdApi.React.createElement('div',
                                    {
                                        class: 'animPreviewsActions'
                                    },
                                    BdApi.React.createElement('div',
                                        {
                                            class: `animPreviewActionButton ${this.settings[options.class].custom.enabled ? 'editing' : 'selecting'} title-3sZWYQ`,
                                            onClick: (e) => {
                                                this.settings[options.class].custom.enabled = !this.settings[options.class].custom.enabled;
                                                PluginUtilities.saveSettings("Animations", this.settings);
                                                this.changeStyles();

                                                var panel = e.currentTarget.closest('.animPreviewsPanel');
                                                var all = panel.querySelectorAll(`.animPreviewsContainer, .animTextareaPanel`)
                                                all.forEach(elem => elem.classList.remove('show'));
                                                if (this.settings[options.class].custom.enabled) {
                                                    e.currentTarget.classList.add('editing')
                                                    e.currentTarget.classList.remove('selecting')
                                                    panel.getElementsByClassName(`animTextareaPanel`)[this.settings[options.class].custom.page].classList.add('show');
                                                    panel.getElementsByClassName('animPageButtons default')[0].classList.remove('show');
                                                    panel.getElementsByClassName('animPageButtons custom')[0].classList.add('show');
                                                } else {
                                                    e.currentTarget.classList.remove('editing')
                                                    e.currentTarget.classList.add('selecting')
                                                    panel.getElementsByClassName(`animPreviewsContainer`)[this.settings[options.class].page].classList.add('show');
                                                    panel.getElementsByClassName('animPageButtons default')[0].classList.add('show');
                                                    panel.getElementsByClassName('animPageButtons custom')[0].classList.remove('show');
                                                }
                                            }
                                        },

                                        BdApi.React.createElement('div',
                                            {
                                                class: 'switchActionButton'
                                            },
                                            [
                                                BdApi.React.createElement('div', {
                                                    class: 'switchActionButtonLabel'
                                                },
                                                    'Selecting'
                                                ),
                                                BdApi.React.createElement("svg", {
                                                    width: "24",
                                                    height: "24",
                                                    viewBox: "3 2 19 19"
                                                },
                                                    BdApi.React.createElement("path", {
                                                        style: { fill: "none" },
                                                        d: "M0 0h24v24H0z"
                                                    }),
                                                    BdApi.React.createElement("path", {
                                                        d: options.horizontal ? "M 4 18 h 17 v -3 H 4 v 3 z M 4 10 v 3 h 17 v -3 h -17 M 4 5 v 3 h 17 V 5 H 4 z" : "M4 11h5V5H4v6zm0 7h5v-6H4v6zm6 0h5v-6h-5v6zm6 0h5v-6h-5v6zm-6-7h5V5h-5v6zm6-6v6h5V5h-5z"
                                                    })
                                                )
                                            ]
                                        ),
                                        BdApi.React.createElement('div',
                                            {
                                                class: 'switchActionButton'
                                            },
                                            [
                                                BdApi.React.createElement('div', {
                                                    class: 'switchActionButtonLabel'
                                                },
                                                    'Editing'
                                                ),
                                                BdApi.React.createElement("svg", {
                                                    width: "24",
                                                    height: "24",
                                                    viewBox: "0 1 22 22"
                                                },
                                                    BdApi.React.createElement("path", {
                                                        d: "M19.2929 9.8299L19.9409 9.18278C21.353 7.77064 21.353 5.47197 19.9409 4.05892C18.5287 2.64678 16.2292 2.64678 14.817 4.05892L14.1699 4.70694L19.2929 9.8299ZM12.8962 5.97688L5.18469 13.6906L10.3085 18.813L18.0201 11.0992L12.8962 5.97688ZM4.11851 20.9704L8.75906 19.8112L4.18692 15.239L3.02678 19.8796C2.95028 20.1856 3.04028 20.5105 3.26349 20.7337C3.48669 20.9569 3.8116 21.046 4.11851 20.9704Z",
                                                    })
                                                )
                                            ]
                                        )
                                    )
                                ) : null,
                                ...containers,
                                ...textareas,
                                containers.length > 1 ?
                                    BdApi.React.createElement('div',
                                        {
                                            class: `animPageButtons default ${options.custom ? (!this.settings[options.class].custom.enabled ? 'show' : '') : 'show'}`,
                                        },
                                        swipeButtonsDefault
                                    ) : null,
                                BdApi.React.createElement('div',
                                    {
                                        class: `animPageButtons custom ${options.custom ? (this.settings[options.class].custom.enabled ? 'show' : '') : 'show'}`,
                                    },
                                    swipeButtonsCustom
                                ),
                            ])


                        class Panel extends BdApi.React.Component {
                            render() {
                                return result
                            }
                        }

                        return {class: Panel, render: result};
                    }

                    setTimeout(()=>{
                        Tooltip.create(document.getElementById('animations-reset'), 'Resets all settings', {side: 'left'})
                        Tooltip.create(document.getElementById('animations-rebuild'), 'Recreates styles. When the plugin is restarted, the styles are recreates too', {side: 'top'})
                        Tooltip.create(document.getElementById('animations-version-check'), 'Checks for updates', {side: 'right'})

                        Tooltip.create(document.getElementById('animations-issues'), 'Link to GitHub', {side: 'left'})
                        Tooltip.create(document.getElementById('animations-discussions'), 'Link to GitHub', {side: 'right'})

                        Tooltip.create(document.getElementById('lists-switch-button'), 'Lists switch', {side: 'bottom'})
                        Tooltip.create(document.getElementById('messages-switch-button'), 'Messages switch', {side: 'bottom'})
                        Tooltip.create(document.getElementById('buttons-switch-button'), 'Buttons switch', {side: 'bottom'})

                        Tooltip.create(document.getElementById('animations-reset-lists'), 'Resets lists settings', {side: 'bottom'})
                        Tooltip.create(document.getElementById('animations-reset-messages'), 'Resets messages settings', {side: 'bottom'})
                        Tooltip.create(document.getElementById('animations-reset-buttons'), 'Resets buttons settings', {side: 'bottom'})

                        Tooltip.create(document.getElementById('lists-selectors-default'), 'Restores default selectors', {side: 'bottom'})
                        Tooltip.create(document.getElementById('lists-selectors-clear'), 'Clears the textarea', {side: 'bottom'})

                        Tooltip.create(document.getElementById('buttons-selectors-default'), 'Restores default selectors', {side: 'bottom'})
                        Tooltip.create(document.getElementById('buttons-selectors-clear'), 'Clears the textarea', {side: 'bottom'})
                    }, 500)

                    return Settings.SettingPanel.build(
                        this.saveSettings.bind(this),

                        new Settings.SettingField(null, null, null,
                            ButtonsPanel(
                            [
                                {
                                    buttons: [
                                        {
                                            color: 'blurple',
                                            label: 'Reset all',
                                            id: 'animations-reset',
                                            svgView: '0 0 20 20',
                                            svgPath: 'M15.95 10.78c.03-.25.05-.51.05-.78s-.02-.53-.06-.78l1.69-1.32c.15-.12.19-.34.1-.51l-1.6-2.77c-.1-.18-.31-.24-.49-.18l-1.99.8c-.42-.32-.86-.58-1.35-.78L12 2.34c-.03-.2-.2-.34-.4-.34H8.4c-.2 0-.36.14-.39.34l-.3 2.12c-.49.2-.94.47-1.35.78l-1.99-.8c-.18-.07-.39 0-.49.18l-1.6 2.77c-.1.18-.06.39.1.51l1.69 1.32c-.04.25-.07.52-.07.78s.02.53.06.78L2.37 12.1c-.15.12-.19.34-.1.51l1.6 2.77c.1.18.31.24.49.18l1.99-.8c.42.32.86.58 1.35.78l.3 2.12c.04.2.2.34.4.34h3.2c.2 0 .37-.14.39-.34l.3-2.12c.49-.2.94-.47 1.35-.78l1.99.8c.18.07.39 0 .49-.18l1.6-2.77c.1-.18.06-.39-.1-.51l-1.67-1.32zM10 13c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z',
                                            onclick: (e) => {

                                                let button = e.currentTarget;

                                                PluginUtilities.saveSettings("Animations", this.defaultSettings);
                                                this.settings = PluginUtilities.loadSettings("Animations", this.defaultSettings);
                                                this.changeStyles(200);
                                                button.innerText = 'Reseting...';
                                                this.closeSettings();
                                            }
                                        },
                                        {
                                            color: 'blurple',
                                            label: 'Rebuild animations',
                                            id: 'animations-rebuild',
                                            svgPath: 'M 13 3 c -4.97 0 -9 4.03 -9 9 H 1 l 3.89 3.89 l 0.07 0.14 L 9 12 H 6 c 0 -3.87 3.13 -7 7 -7 s 7 3.13 7 7 s -3.13 7 -7 7 c -1.93 0 -3.68 -0.79 -4.94 -2.06 l -1.42 1.42 C 8.27 19.99 10.51 21 13 21 c 4.97 0 9 -4.03 9 -9 s -4.03 -9 -9 -9 z',
                                            onclick: (e) => this.changeStyles(200)
                                        },
                                        {
                                            color: 'blurple',
                                            label: 'Update',
                                            id: 'animations-version-check',
                                            inverted: false,
                                            onclick: (e) => {

                                                let button = e.currentTarget;

                                                button.innerText = 'Searching for updates...';

                                                const Http = new XMLHttpRequest();
                                                Http.open("GET", 'https://api.github.com/repos/Mopsgamer/BetterDiscord-codes/contents/plugins/Animations/Animations.plugin.js');
                                                Http.send();

                                                Http.timeout = 5000;
                                                Http.ontimeout = function (e) {
                                                    button.innerText = 'Timeout exceeded';
                                                    button.classList.remove('blurple')
                                                    button.classList.add('red')
                                                };

                                                Http.onreadystatechange = (e) => {
                                                    if (e.currentTarget.readyState != 4) return

                                                    if (!Http.responseText) {
                                                        button.innerText = 'An error occurred';
                                                        button.classList.remove('blurple')
                                                        button.classList.add('red')
                                                        return
                                                    }

                                                    var responseCode = JSON.parse(Http.responseText)
                                                    var response = window.atob(responseCode.content)
                                                    var GitHubVersion = (/(\d+\.)*\d+/).exec((/^.*@version\s+(\d+\.)\d+.*$/m).exec(response))[0]

                                                    function newerVersion(v1, v2) {
                                                        var v1Dots = v1.match(/\./g).length
                                                        var v2Dots = v2.match(/\./g).length
                                                        const newParts = v1.split('.')
                                                        const oldParts = v2.split('.')

                                                        for (var i = 0; i < (v1Dots > v2Dots ? v1Dots : v2Dots) + 1; i++) {
                                                            const a = parseInt(newParts[i]) || 0
                                                            const b = parseInt(oldParts[i]) || 0
                                                            if (a > b) return v1
                                                            if (a < b) return v2
                                                        }
                                                        return false
                                                    }

                                                    switch (newerVersion(GitHubVersion, config.info.version)) {
                                                        case GitHubVersion:
                                                            button.innerText = `v${GitHubVersion} - Update`
                                                            button.classList.remove('blurple')
                                                            button.classList.add('green')
                                                            button.addEventListener('click',
                                                                () => {
                                                                    BdApi.showConfirmationModal('Your version is older',
                                                                        [
                                                                            `v${config.info.version} (your)  →  v${GitHubVersion} (github)`,
                                                                            BdApi.React.createElement('span', { style: { color: this.colors.green, 'text-transform': 'uppercase' } }, 'The plugin will be updated.')
                                                                        ],
                                                                        {
                                                                            onConfirm() {
                                                                                PluginUpdater.downloadPlugin('Animations', 'https://raw.githubusercontent.com/Mopsgamer/BetterDiscord-codes/main/plugins/Animations/Animations.plugin.js')
                                                                            }
                                                                        })
                                                                },
                                                                { once: true }
                                                            )
                                                            break;
                                                        case config.info.version:
                                                            button.innerText = `v${config.info.version} - Your own version`
                                                            button.classList.remove('blurple')
                                                            button.classList.add('grey')
                                                            button.addEventListener('click',
                                                                () => {
                                                                    BdApi.showConfirmationModal('Your version is newer',
                                                                        [
                                                                            `v${config.info.version} (your)  →  v${GitHubVersion} (github)`,
                                                                            BdApi.React.createElement('span', { style: { color: this.colors.red, 'text-transform': 'uppercase' } }, 'The plugin will be downdated.')
                                                                        ],
                                                                        {
                                                                            onConfirm() {
                                                                                PluginUpdater.downloadPlugin('Animations', 'https://raw.githubusercontent.com/Mopsgamer/BetterDiscord-codes/main/plugins/Animations/Animations.plugin.js')
                                                                            }
                                                                        })
                                                                },
                                                                { once: true }
                                                            )
                                                            break;
                                                        case false:
                                                            button.innerText = `v${config.info.version} - Latest version`
                                                            button.classList.remove('blurple')
                                                            button.classList.add('grey')
                                                            button.addEventListener('click',
                                                                () => {
                                                                    BdApi.showConfirmationModal('Your version is latest',
                                                                        [
                                                                            `v${config.info.version} (your)  ↔  v${GitHubVersion} (github)`,
                                                                            BdApi.React.createElement('span', { style: { color: this.colors.yellow, 'text-transform': 'uppercase' } }, 'The plugin will be restored.')
                                                                        ],
                                                                        {
                                                                            onConfirm() {
                                                                                PluginUpdater.downloadPlugin('Animations', 'https://raw.githubusercontent.com/Mopsgamer/BetterDiscord-codes/main/plugins/Animations/Animations.plugin.js')
                                                                            }
                                                                        })
                                                                },
                                                                { once: true }
                                                            )
                                                            break;

                                                        default:
                                                            break;
                                                    }
                                                }
                                            }
                                        }
                                    ],
                                },
                                {
                                    buttons: [
                                        {
                                            label: 'Issues',
                                            color: 'grey',
                                            id: 'animations-issues',
                                            svgPath: 'm12 .5c-6.63 0-12 5.28-12 11.792 0 5.211 3.438 9.63 8.205 11.188.6.111.82-.254.82-.567 0-.28-.01-1.022-.015-2.005-3.338.711-4.042-1.582-4.042-1.582-.546-1.361-1.335-1.725-1.335-1.725-1.087-.731.084-.716.084-.716 1.205.082 1.838 1.215 1.838 1.215 1.07 1.803 2.809 1.282 3.495.981.108-.763.417-1.282.76-1.577-2.665-.295-5.466-1.309-5.466-5.827 0-1.287.465-2.339 1.235-3.164-.135-.298-.54-1.497.105-3.121 0 0 1.005-.316 3.3 1.209.96-.262 1.98-.392 3-.398 1.02.006 2.04.136 3 .398 2.28-1.525 3.285-1.209 3.285-1.209.645 1.624.24 2.823.12 3.121.765.825 1.23 1.877 1.23 3.164 0 4.53-2.805 5.527-5.475 5.817.42.354.81 1.077.81 2.182 0 1.578-.015 2.846-.015 3.229 0 .309.21.678.825.56 4.801-1.548 8.236-5.97 8.236-11.173 0-6.512-5.373-11.792-12-11.792z',
                                            onclick: (e) => {
                                                window.open('https://github.com/Mopsgamer/BetterDiscord-codes/issues')
                                            }
                                        },
                                        {
                                            label: 'Discussions',
                                            color: 'grey',
                                            id: 'animations-discussions',
                                            svgPath: 'm12 .5c-6.63 0-12 5.28-12 11.792 0 5.211 3.438 9.63 8.205 11.188.6.111.82-.254.82-.567 0-.28-.01-1.022-.015-2.005-3.338.711-4.042-1.582-4.042-1.582-.546-1.361-1.335-1.725-1.335-1.725-1.087-.731.084-.716.084-.716 1.205.082 1.838 1.215 1.838 1.215 1.07 1.803 2.809 1.282 3.495.981.108-.763.417-1.282.76-1.577-2.665-.295-5.466-1.309-5.466-5.827 0-1.287.465-2.339 1.235-3.164-.135-.298-.54-1.497.105-3.121 0 0 1.005-.316 3.3 1.209.96-.262 1.98-.392 3-.398 1.02.006 2.04.136 3 .398 2.28-1.525 3.285-1.209 3.285-1.209.645 1.624.24 2.823.12 3.121.765.825 1.23 1.877 1.23 3.164 0 4.53-2.805 5.527-5.475 5.817.42.354.81 1.077.81 2.182 0 1.578-.015 2.846-.015 3.229 0 .309.21.678.825.56 4.801-1.548 8.236-5.97 8.236-11.173 0-6.512-5.373-11.792-12-11.792z',
                                            onclick: (e) => {
                                                window.open('https://github.com/Mopsgamer/BetterDiscord-codes/discussions')
                                            }
                                        }
                                    ],
                                },
                                {
                                    buttons: [
                                        {
                                            color: this.settings.lists.enabled ? 'green' : 'red',
                                            label: 'Lists',
                                            id: 'lists-switch-button',
                                            onclick: (e) => {

                                                let button = e.currentTarget

                                                this.settings.lists.enabled = !this.settings.lists.enabled;
                                                if (!this.settings.lists.enabled) {
                                                    button.classList.remove('green')
                                                    button.classList.add('red')
                                                } else {
                                                    button.classList.remove('red')
                                                    button.classList.add('green')
                                                }
                                                PluginUtilities.saveSettings("Animations", this.settings);
                                                this.changeStyles();
                                            }
                                        },
                                        {
                                            color: this.settings.messages.enabled ? 'green' : 'red',
                                            label: 'Messages',
                                            id: 'messages-switch-button',
                                            onclick: (e) => {

                                                let button = e.currentTarget

                                                this.settings.messages.enabled = !this.settings.messages.enabled;
                                                if (!this.settings.messages.enabled) {
                                                    button.classList.remove('green')
                                                    button.classList.add('red')
                                                } else {
                                                    button.classList.remove('red')
                                                    button.classList.add('green')
                                                }
                                                PluginUtilities.saveSettings("Animations", this.settings);
                                                this.changeStyles();
                                            }
                                        },
                                        {
                                            color: this.settings.buttons.enabled ? 'green' : 'red',
                                            label: 'Buttons',
                                            id: 'buttons-switch-button',
                                            onclick: (e) => {

                                                let button = e.currentTarget

                                                this.settings.buttons.enabled = !this.settings.buttons.enabled;
                                                if (!this.settings.buttons.enabled) {
                                                    button.classList.remove('green')
                                                    button.classList.add('red')
                                                } else {
                                                    button.classList.remove('red')
                                                    button.classList.add('green')
                                                }
                                                PluginUtilities.saveSettings("Animations", this.settings);
                                                this.changeStyles();
                                            }
                                        }
                                    ]
                                }
                            ],
                                {
                                    widthAll: '100%',
                                    align: 'space-between'
                                }).class
                        ),

                        new Settings.SettingGroup('Lists').append(

                            new Settings.SettingField(null, null, null,
                                ButtonsPanel(
                                    [
                                        {
                                            buttons: [
                                                {
                                                    color: 'blurple',
                                                    label: 'Reset lists',
                                                    id: 'animations-reset-lists',
                                                    svgView: '0 0 20 20',
                                                    svgPath: 'M15.95 10.78c.03-.25.05-.51.05-.78s-.02-.53-.06-.78l1.69-1.32c.15-.12.19-.34.1-.51l-1.6-2.77c-.1-.18-.31-.24-.49-.18l-1.99.8c-.42-.32-.86-.58-1.35-.78L12 2.34c-.03-.2-.2-.34-.4-.34H8.4c-.2 0-.36.14-.39.34l-.3 2.12c-.49.2-.94.47-1.35.78l-1.99-.8c-.18-.07-.39 0-.49.18l-1.6 2.77c-.1.18-.06.39.1.51l1.69 1.32c-.04.25-.07.52-.07.78s.02.53.06.78L2.37 12.1c-.15.12-.19.34-.1.51l1.6 2.77c.1.18.31.24.49.18l1.99-.8c.42.32.86.58 1.35.78l.3 2.12c.04.2.2.34.4.34h3.2c.2 0 .37-.14.39-.34l.3-2.12c.49-.2.94-.47 1.35-.78l1.99.8c.18.07.39 0 .49-.18l1.6-2.77c.1-.18.06-.39-.1-.51l-1.67-1.32zM10 13c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z',
                                                    onclick: (e) => {
        
                                                        let button = e.currentTarget;
        
                                                        this.settings.lists = this.defaultSettings.lists
                                                        PluginUtilities.saveSettings("Animations", this.settings);
                                                        this.settings = PluginUtilities.loadSettings("Animations", this.defaultSettings);
                                                        this.changeStyles();
                                                        button.innerText = 'Reseting...';
                                                        this.closeSettings();
                                                    },
                                                }
                                            ],
                                            options: {
                                                widthAll: '100%',
                                                align: 'space-between'
                                            }
                                        }
                                    ]
                                ).class
                            ),

                            new Settings.SettingField('Name', `[default ${this.defaultSettings.lists.name}] The name of the animation of the list items when they appear.`, null,
                                PreviewsPanel([
                                    { label: 'In', value: 'in' },
                                    { label: 'Out', value: 'out' },
                                    { label: 'Opacity', value: 'opacity' },
                                    { label: 'Slime', value: 'slime' },
                                    { label: 'Brick right', value: 'brick-right' },
                                    { label: 'Brick left', value: 'brick-left' },
                                    { label: 'Brick up', value: 'brick-up' },
                                    { label: 'Brick down', value: 'brick-down' },
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
                                    { label: 'Wide skew right', value: 'wide-skew-right' },
                                    { label: 'Wide skew left', value: 'wide-skew-left' },
                                ], {
                                    type: 'lists-name',
                                    class: 'lists',
                                    custom: {
                                        data: this.settings.lists.custom,
                                    }
                                },
                                    this.settings.lists.name, (e) => {
                                        this.settings.lists.name = e.value;
                                        this.settings.lists.page = e.page;
                                        PluginUtilities.saveSettings("Animations", this.settings);
                                        this.changeStyles()
                                    }).class,
                                { noteOnTop: true }
                            ),

                            new Settings.SettingField('Sequence', `[default ${this.defaultSettings.lists.sequence}] The sequence in which the list items are built.`, null,
                                PreviewsPanel([
                                    { label: '↓', value: 'fromFirst' },
                                    { label: '↑', value: 'fromLast' },
                                ], {
                                    type: 'lists-sequence'
                                }, this.settings.lists.sequence, (e) => {
                                    this.settings.lists.sequence = e.value;
                                    PluginUtilities.saveSettings("Animations", this.settings);
                                    this.changeStyles()
                                }).class,
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
                            ),
                        ),

                        new Settings.SettingGroup('Messages').append(

                            new Settings.SettingField(null, null, null,
                                ButtonsPanel(
                                    [
                                        {
                                            buttons: [
                                                {
                                                    color: 'blurple',
                                                    label: 'Reset messages',
                                                    id: 'animations-reset-messages',
                                                    svgView: '0 0 20 20',
                                                    svgPath: 'M15.95 10.78c.03-.25.05-.51.05-.78s-.02-.53-.06-.78l1.69-1.32c.15-.12.19-.34.1-.51l-1.6-2.77c-.1-.18-.31-.24-.49-.18l-1.99.8c-.42-.32-.86-.58-1.35-.78L12 2.34c-.03-.2-.2-.34-.4-.34H8.4c-.2 0-.36.14-.39.34l-.3 2.12c-.49.2-.94.47-1.35.78l-1.99-.8c-.18-.07-.39 0-.49.18l-1.6 2.77c-.1.18-.06.39.1.51l1.69 1.32c-.04.25-.07.52-.07.78s.02.53.06.78L2.37 12.1c-.15.12-.19.34-.1.51l1.6 2.77c.1.18.31.24.49.18l1.99-.8c.42.32.86.58 1.35.78l.3 2.12c.04.2.2.34.4.34h3.2c.2 0 .37-.14.39-.34l.3-2.12c.49-.2.94-.47 1.35-.78l1.99.8c.18.07.39 0 .49-.18l1.6-2.77c.1-.18.06-.39-.1-.51l-1.67-1.32zM10 13c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z',
                                                    onclick: (e) => {
        
                                                        let button = e.currentTarget;
        
                                                        this.settings.messages = this.defaultSettings.messages
                                                        PluginUtilities.saveSettings("Animations", this.settings);
                                                        this.settings = PluginUtilities.loadSettings("Animations", this.defaultSettings);
                                                        this.changeStyles();
                                                        button.innerText = 'Reseting...';
                                                        this.closeSettings();
                                                    },
                                                }
                                            ],
                                            options: {
                                                widthAll: '100%',
                                                align: 'space-between'
                                            }
                                        }
                                    ]
                                ).class
                            ),

                            new Settings.SettingField('Name', `[default ${this.defaultSettings.messages.name}] The name of the animation of the messages when they appear.`, null,
                                PreviewsPanel([
                                    { label: 'In', value: 'in' },
                                    { label: 'Out', value: 'out' },
                                    { label: 'Opacity', value: 'opacity' },
                                    { label: 'Slime', value: 'slime' },
                                    { label: 'Brick right', value: 'brick-right' },
                                    { label: 'Brick left', value: 'brick-left' },
                                    { label: 'Brick up', value: 'brick-up' },
                                    { label: 'Brick down', value: 'brick-down' },
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
                                    { label: 'Wide skew right', value: 'wide-skew-right' },
                                    { label: 'Wide skew left', value: 'wide-skew-left' },
                                ], {
                                    type: 'messages-name',
                                    class: 'messages',
                                    custom: {
                                        data: this.settings.messages.custom,
                                    }
                                },
                                    this.settings.messages.name, (e) => {
                                        this.settings.messages.name = e.value;
                                        this.settings.messages.page = e.page;
                                        PluginUtilities.saveSettings("Animations", this.settings);
                                        this.changeStyles()
                                    }).class,
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

                        ),

                        new Settings.SettingGroup('Buttons').append(

                            new Settings.SettingField(null, null, null,
                                ButtonsPanel(
                                    [
                                        {
                                            buttons: [
                                                {
                                                    color: 'blurple',
                                                    label: 'Reset buttons',
                                                    id: 'animations-reset-buttons',
                                                    svgView: '0 0 20 20',
                                                    svgPath: 'M15.95 10.78c.03-.25.05-.51.05-.78s-.02-.53-.06-.78l1.69-1.32c.15-.12.19-.34.1-.51l-1.6-2.77c-.1-.18-.31-.24-.49-.18l-1.99.8c-.42-.32-.86-.58-1.35-.78L12 2.34c-.03-.2-.2-.34-.4-.34H8.4c-.2 0-.36.14-.39.34l-.3 2.12c-.49.2-.94.47-1.35.78l-1.99-.8c-.18-.07-.39 0-.49.18l-1.6 2.77c-.1.18-.06.39.1.51l1.69 1.32c-.04.25-.07.52-.07.78s.02.53.06.78L2.37 12.1c-.15.12-.19.34-.1.51l1.6 2.77c.1.18.31.24.49.18l1.99-.8c.42.32.86.58 1.35.78l.3 2.12c.04.2.2.34.4.34h3.2c.2 0 .37-.14.39-.34l.3-2.12c.49-.2.94-.47 1.35-.78l1.99.8c.18.07.39 0 .49-.18l1.6-2.77c.1-.18.06-.39-.1-.51l-1.67-1.32zM10 13c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z',
                                                    onclick: (e) => {
        
                                                        let button = e.currentTarget;
        
                                                        this.settings.buttons = this.defaultSettings.buttons
                                                        PluginUtilities.saveSettings("Animations", this.settings);
                                                        this.settings = PluginUtilities.loadSettings("Animations", this.defaultSettings);
                                                        this.changeStyles();
                                                        button.innerText = 'Reseting...';
                                                        this.closeSettings();
                                                    },
                                                }
                                            ],
                                            options: {
                                                widthAll: '100%',
                                                align: 'space-between'
                                            }
                                        }
                                    ]
                                ).class
                            ),

                            new Settings.SettingField('Name', `[default ${this.defaultSettings.buttons.name}] The name of the animation of the buttons when they appear.`, null,
                                PreviewsPanel([
                                    { label: 'In', value: 'in' },
                                    { label: 'Out', value: 'out' },
                                    { label: 'Opacity', value: 'opacity' },
                                    { label: 'Slime', value: 'slime' },
                                    { label: 'Brick right', value: 'brick-right' },
                                    { label: 'Brick left', value: 'brick-left' },
                                    { label: 'Brick up', value: 'brick-up' },
                                    { label: 'Brick down', value: 'brick-down' },
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
                                    { label: 'Wide skew right', value: 'wide-skew-right' },
                                    { label: 'Wide skew left', value: 'wide-skew-left' },
                                ], {
                                    type: 'buttons-name',
                                    class: 'buttons',
                                    horizontal: true,
                                    custom: {
                                        data: this.settings.buttons.custom,
                                    }
                                },
                                    this.settings.buttons.name, (e) => {
                                        this.settings.buttons.name = e.value;
                                        this.settings.buttons.page = e.page;
                                        PluginUtilities.saveSettings("Animations", this.settings);
                                        this.changeStyles()
                                    }).class,
                                { noteOnTop: true }
                            ),

                            new Settings.SettingField('Sequence', `[default ${this.defaultSettings.buttons.sequence}] The sequence in which the buttons are built.`, null,
                                PreviewsPanel([
                                    { label: '→', value: 'fromFirst' },
                                    { label: '←', value: 'fromLast' },
                                ], {
                                    type: 'buttons-sequence',
                                    horizontal: true
                                }, this.settings.buttons.sequence, (e) => {
                                    this.settings.buttons.sequence = e.value;
                                    PluginUtilities.saveSettings("Animations", this.settings);
                                    this.changeStyles()
                                }).class,
                                { noteOnTop: true }
                            ),

                            new Settings.Slider('Delay', `[default ${this.defaultSettings.buttons.delay}] Delay before appearing for each button in seconds.`, 1, 10, this.settings.buttons.delay,
                                (e) => {
                                    this.settings.buttons.delay = e;
                                    this.changeStyles()
                                }, {
                                markers: [0, 0.01, 0.02, 0.04, 0.06, 0.08, 0.1, 0.12, 0.15, 0.2, 0.25, 0.3],
                                stickToMarkers: true
                            }
                            ),

                            new Settings.Slider('Duration', `[default ${this.defaultSettings.buttons.duration}] Animation playback speed in seconds for each button after the delay.`, 1, 10, this.settings.buttons.duration,
                                (e) => {
                                    this.settings.buttons.duration = e;
                                    this.changeStyles()
                                }, {
                                markers: [0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 1, 1.2, 1.5, 2],
                                stickToMarkers: true
                            }
                            )
                        ),

                        new Settings.SettingGroup('Advanced').append(
                            new Settings.SettingField('Selectors of lists', 'If you leave this field empty, the default selectors will appear here on reload. Changes to the selectors are saved when typing (if the code is valid). The separator is a comma(,).', null,
                                TextareaPanel({
                                    buttonsPanel: {
                                        containersTemp: [
                                            {
                                                buttons: [
                                                    {
                                                        label: 'Default',
                                                        id: 'lists-selectors-default',
                                                        svgPath: 'M 13 3 c -4.97 0 -9 4.03 -9 9 H 1 l 3.89 3.89 l 0.07 0.14 L 9 12 H 6 c 0 -3.87 3.13 -7 7 -7 s 7 3.13 7 7 s -3.13 7 -7 7 c -1.93 0 -3.68 -0.79 -4.94 -2.06 l -1.42 1.42 C 8.27 19.99 10.51 21 13 21 c 4.97 0 9 -4.03 9 -9 s -4.03 -9 -9 -9 z',
                                                        onclick: (e) => {
                                                            var textarea = e.currentTarget.closest('.animTextareaPanel').querySelector('.animTextarea')
                                                            textarea.value = Animations.selectorsLists.join(',\n\n')
                                                            textarea.style.color = '';

                                                            this.settings.lists.selectors = '';
                                                            PluginUtilities.saveSettings("Animations", this.settings);
                                                        }
                                                    },
                                                    {
                                                        label: 'Clear',
                                                        id: 'lists-selectors-clear',
                                                        onclick: (e) => {
                                                            var textarea = e.currentTarget.closest('.animTextareaPanel').querySelector('.animTextarea')
                                                            textarea.value = '';
                                                            textarea.focus();
                                                        }
                                                    },
                                                ]
                                            }
                                        ],
                                        options: {
                                            widthAll: '100%'
                                        }
                                    }
                                },
                                this.settings.lists.selectors ? this.settings.lists.selectors : Animations.selectorsLists.join(',\n\n'),
                                (e) => {
                                    var textarea = e.currentTarget;
                                    var value = textarea.value;

                                    if(value=='' || this.isValidSelector(value)) {
                                        this.settings.lists.selectors = (value==Animations.selectorsLists?'':value)
                                        PluginUtilities.saveSettings("Animations", this.settings);
                                        this.changeStyles()
                                        textarea.style.color = ''
                                    } else {
                                        textarea.style.color = this.colors.red
                                    }
                                }
                                ).class
                            ),
                            new Settings.SettingField('Selectors of buttons', 'If you leave this field empty, the default selectors will appear here on reload. Changes to the selectors are saved when typing (if the code is valid). The separator is a comma (,).', null,
                                TextareaPanel({
                                    buttonsPanel: {
                                        containersTemp: [
                                            {
                                                buttons: [
                                                    {
                                                        label: 'Default',
                                                        id: 'buttons-selectors-default',
                                                        svgPath: 'M 13 3 c -4.97 0 -9 4.03 -9 9 H 1 l 3.89 3.89 l 0.07 0.14 L 9 12 H 6 c 0 -3.87 3.13 -7 7 -7 s 7 3.13 7 7 s -3.13 7 -7 7 c -1.93 0 -3.68 -0.79 -4.94 -2.06 l -1.42 1.42 C 8.27 19.99 10.51 21 13 21 c 4.97 0 9 -4.03 9 -9 s -4.03 -9 -9 -9 z',
                                                        onclick: (e) => {
                                                            var textarea = e.currentTarget.closest('.animTextareaPanel').querySelector('.animTextarea')
                                                            textarea.value = Animations.selectorsButtons.join(',\n\n')
                                                            textarea.style.color = '';

                                                            this.settings.lists.selectors = '';
                                                            PluginUtilities.saveSettings("Animations", this.settings);
                                                        }
                                                    },
                                                    {
                                                        label: 'Clear',
                                                        id: 'buttons-selectors-clear',
                                                        onclick: (e) => {
                                                            var textarea = e.currentTarget.closest('.animTextareaPanel').querySelector('.animTextarea')
                                                            textarea.value = '';
                                                            textarea.focus();
                                                        }
                                                    }
                                                ]
                                            }
                                        ],
                                        options: {
                                            widthAll: '100%'
                                        }
                                    }
                                },
                                this.settings.buttons.selectors ? this.settings.buttons.selectors : Animations.selectorsButtons.join(',\n\n'),
                                (e) => {
                                    var textarea = e.currentTarget;
                                    var value = textarea.value;

                                    if(value=='' || this.isValidSelector(value)) {
                                        this.settings.buttons.selectors = (value==Animations.selectorsButtons?'':value)
                                        PluginUtilities.saveSettings("Animations", this.settings);
                                        this.changeStyles()
                                        textarea.style.color = ''
                                    } else {
                                        textarea.style.color = this.colors.red
                                    }
                                }
                                ).class
                            ),
                        )
                    )
                }

                start() {
                    this.CompStyles =
                    `/*components*/

                    .animPreviewsPanel {
                        overflow: hidden;
                    }

                    .animPreviewsContainer, .animPreviewsPanel .animTextareaPanel {
                        display: flex;
                        flex-wrap: wrap;
                        justify-content: space-evenly; 
                        align-content: space-evenly;
                        height: 0;
                        margin: 0;
                        padding: 0;
                        opacity: 0;
                        box-sizing: border-box;
                        border-radius: 3px;
                        overflow: hidden;
                        transition: 0.5s opacity;
                    }

                    .animPreviewsPanel .animTextareaPanel {
                        padding: 0 18px;
                    }

                    .animTextarea {
                        display: block;
                        font-size: 0.875rem;
                        line-height: 1.125rem;
                        text-indent: 0;
                        white-space: pre-wrap;
                        font-family: Consolas, monospace;
                    }

                    .animTextarea::placeholder {
                        font-family: Consolas, monopoly;
                    }

                    .animPreviewsContainer.show, .animPreviewsPanel .animTextareaPanel.show {
                        opacity: 1;
                        border: 1px solid var(--background-tertiary);
                        height: 378px;
                    }

                    .animPreviewsContainer.compact {
                        border: none;
                        height: fit-content;
                    }

                    .animPreviewsActions {
                        width: fit-content;
                        margin: 0 auto;
                    }

                    .animPreviewActionButton {
                        display: inline-block;
                        min-width: 10px;
                        width: fit-content;
                        margin: 5px auto 5px auto;
                        color: var(--interactive-normal);
                        text-align: center;
                        text-transform: capitalize;
                        font-size: 18px;
                        background-color: var(--background-secondary);
                        border: 1px solid var(--background-tertiary);
                        border-radius: 3px;
                        transition: 0.2s;
                        overflow: hidden;
                    }

                    .animPreviewActionButton:hover {
                        border-color: var(--deprecated-text-input-border-hover);
                    }

                    .switchActionButton {
                        display: inline-flex;
                        justify-content: space-between;
                        line-height: initial;
                        width: 120px;
                        padding: 3px 8px;
                        transition: 0.2s background;
                        background-size: cover;
                        background: linear-gradient(90deg, transparent 0%, var(--brand-experiment) 0%, var(--brand-experiment) 100%, transparent 100%) no-repeat;
                    }

                    .switchActionButton > svg {
                        fill: var(--interactive-normal);
                    }

                    .selecting .switchActionButton:nth-child(1), .editing .switchActionButton:nth-child(2) {
                        color: white;
                        background-position-x: 0;
                    }

                    .selecting .switchActionButton:nth-child(1) > svg, .editing .switchActionButton:nth-child(2) > svg {
                        fill: white;
                    }

                    .editing .switchActionButton:nth-child(1) {
                        background-position-x: 200px;
                    }

                    .selecting .switchActionButton:nth-child(2) {
                        background-position-x: -200px;
                    }

                    .animPreviewActionButton .switchActionButton:nth-child(n+2) {
                        border-left: 1px solid var(--background-tertiary);
                    }

                    .animPreviewActionButton:hover .switchActionButton:nth-child(n+2) {
                        border-left: 1px solid var(--deprecated-text-input-border-hover);
                    }

                    .switchActionButtonLabel {
                        display: inline-block;
                        overflow: hidden;
                        width: 100%;
                        text-overflow: ellipsis;
                    }

                    .animPageButtons {
                        margin: 0 auto;
                        width: fit-content;
                        display: none;
                    }

                    .animPageButtons.show {
                        display: block;
                    }

                    .animPageCircleButton {
                        display: inline-block;
                        min-width: 10px;
                        width: fit-content;
                        height: 0;
                        margin: 5px 5px;
                        padding: 5px 9px 25px 11px;
                        color: var(--interactive-normal);
                        text-align: center;
                        font-size: 18px;
                        font-family: Consolas, monospace;
                        background-color: var(--background-secondary);
                        border: 1px solid var(--background-tertiary);
                        border-radius: 100px;
                        transition: 0.2s;
                    }

                    .animPageCircleButton:first-child {
                        margin: 5px 5px 5px auto;
                    }

                    .animPageCircleButton:last-child {
                        margin: 5px auto 5px 5px;
                    }

                    .animPageCircleButton:hover {
                        border-color: var(--deprecated-text-input-border-hover);
                    }

                    .animPageCircleButton.enabled {
                        color: white;
                        background-color: var(--brand-experiment);
                    }

                    .animPreview {
                        background-color: var(--background-secondary);
                        border: 1px solid var(--background-tertiary);
                        border-radius: 3px;
                        overflow: hidden;
                    }

                    .vertical .animPreview {
                        display: inline-flex;
                        box-sizing: border-box;
                        width: 120px;
                        height: 165px;
                        padding: 5px;
                        transition: 0.2s;
                        flex-direction: column;
                        justify-content: space-evenly;
                    }

                    .horizontal .animPreview {
                        display: inline-flex;
                        box-sizing: border-box;
                        width: calc(100% - 26px);
                        height: 45px;
                        padding: 5px;
                        transition: 0.2s;
                        flex-direction: row;
                        justify-content: space-evenly;
                        align-items: center;
                    }

                    .horizontal .compact .animPreview {
                        margin: 5px 0;
                    }

                    .animPreview:hover {
                        border-color: var(--deprecated-text-input-border-hover);
                    }

                    .animPreview.enabled {
                        background-color: var(--brand-experiment);
                    }
                    
                    .vertical .animPreview .animTempBlock {
                        width: auto;
                        height: 18%;
                        margin: 4px;
                        border-radius: 3pt;
                        background-color: var(--interactive-normal)
                    }

                    .horizontal .animPreview .animTempBlock {
                        width: 15%;
                        height: 26px;
                        margin: 4px;
                        border-radius: 3pt;
                        background-color: var(--interactive-normal);
                        display: inline-block;
                    }

                    .vertical .animPreview.enabled .animTempBlock {
                        background-color: #fff;
                    }

                    .animPreview.enabled .animTempBlock {
                        background-color: #fff;
                    }

                    .animPreview .animPreviewLabel {
                        box-sizing: border-box;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        color: var(--interactive-normal);
                        font-size: 10pt;
                        margin: 4px;
                        padding: 0 4px;
                    }
                    
                    .vertical .animPreview .animPreviewLabel {
                        height: 25px;
                        width: auto;
                        bottom: 6pt;
                        line-height: 150%;
                        text-align: center;
                    }

                    .horizontal .animPreview .animPreviewLabel {
                        height: 26px;
                        width: 30%;
                        display: inline-block;
                        float: right;
                        line-height: 200%;
                        text-align: right;
                    }

                    .animPreview.enabled .animPreviewLabel {
                        color: #fff;
                        border-color: #fff;
                    }

                    
                    button.blurple.filled {
                        color: white;
                        background-color: var(--brand-experiment);
                    }
                    button.blurple.filled:hover {
                        background-color: var(--brand-experiment-560);
                    }
                    button.blurple.inverted {
                        color: var(--brand-experiment);
                        border: 1px solid var(--brand-experiment);
                    }
                    button.blurple.inverted:hover {
                        color: var(--brand-experiment-560);
                        border: 1px solid var(--brand-experiment-560);
                    }
                    
                    button.white.filled {
                        color: var(--brand-experiment);
                        background-color: #fff;
                    }
                    button.white.filled:hover {
                        background-color: var(--brand-experiment-100);
                    }
                    button.white.inverted {
                        color: #fff;
                        border: 1px solid #fff;
                    }
                    button.white.inverted:hover {
                        color: var(--brand-experiment-100);
                        border: 1px solid var(--brand-experiment-100);
                    }

                    button.grey.filled {
                        color: white;
                        background-color: #4f545c;
                    }
                    button.grey.filled:hover {
                        background-color: #5d6269;
                    }
                    button.grey.inverted {
                        color: #4f545c;
                        border: 1px solid #4f545c;
                    }
                    button.grey.inverted:hover {
                        color: #5d6269;
                        border: 1px solid #5d6269;
                    }

                    button.red.filled {
                        color: white;
                        background-color: hsl(359,calc(var(--saturation-factor, 1)*82.6%),59.4%);
                    }
                    button.red.filled:hover {
                        background-color: hsl(359,calc(var(--saturation-factor, 1)*56.7%),48%);
                    }
                    button.red.inverted {
                        color: hsl(359,calc(var(--saturation-factor, 1)*82.6%),59.4%);
                        border: 1px solid hsl(359,calc(var(--saturation-factor, 1)*82.6%),59.4%);
                    }
                    button.red.inverted:hover {
                        color: hsl(359,calc(var(--saturation-factor, 1)*56.7%),48%);
                        border: 1px solid hsl(359,calc(var(--saturation-factor, 1)*56.7%),48%);
                    }

                    button.yellow.filled {
                        color: white;
                        background-color: ${this.colors.yellow};
                    }
                    button.yellow.filled:hover {
                        background-color: ${this.colors.yellow};
                    }
                    button.yellow.inverted {
                        color: ${this.colors.yellow};
                        border: 1px solid ${this.colors.yellow};
                    }
                    button.yellow.inverted:hover {
                        color: ${this.colors.yellow};
                        border: 1px solid ${this.colors.yellow};
                    }

                    button.green.filled {
                        color: white;
                        background-color: hsl(139,calc(var(--saturation-factor, 1)*47.3%),43.9%);
                    }
                    button.green.filled:hover {
                        background-color: hsl(139,calc(var(--saturation-factor, 1)*47.1%),33.3%);
                    }
                    button.green.inverted {
                        color: hsl(139,calc(var(--saturation-factor, 1)*47.3%),43.9%);
                        border: 1px solid hsl(139,calc(var(--saturation-factor, 1)*47.3%),43.9%);
                    }
                    button.green.inverted:hover {
                        color: hsl(139,calc(var(--saturation-factor, 1)*47.1%),33.3%);
                        border: 1px solid hsl(139,calc(var(--saturation-factor, 1)*47.1%),33.3%);
                    }
                    `

                    PluginUtilities.removeStyle('Animations-req');
                    setTimeout(() => {
                        PluginUtilities.addStyle('Animations-req', this.CompStyles)
                        this.changeStyles()
                    }, 100);

                    this.BadSendingStyles = (e)=>{
                        if(e.key=="Enter") { // finding parent
                            var BadSendingTextNode = document.querySelector('.isSending-3SiDwE, .isFailed-2b8sCy')
                            if(!BadSendingTextNode) {
                                setTimeout(()=>{
                                    BadSendingTextNode = this.BadSendingStyles(e)
                                    return BadSendingTextNode
                                }, 50)// frequency of checks after pressing Enter
                            } else {
                            var result = BadSendingTextNode.closest('.message-2CShn3');// this is where we found it
                            // there styles for parent
                            result.style.animation = 'none'
                            result.style.transform = 'none'
                            }
                        }
                    }

                    document.addEventListener('keyup', this.BadSendingStyles)
                    // scrolling channels => update styles
                    this.channelsScrollTimer = -1;
                    this.channelsScroll = () => {
                        if (this.channelsScrollTimer != -1) clearTimeout(this.channelsScrollTimer);
                        this.channelsScrollTimer = setTimeout(()=>this.threadsWithChannels(), 40);// scroll event delay
                    }

                    var chn = ()=>{
                        var channels = document.getElementById('channels')
                        if(channels==null) return
                        channels.addEventListener('scroll', this.channelsScroll)
                        channels.addEventListener('mouseup', this.channelsScroll)
                        this.threadsWithChannels()
                        clearInterval(chni)
                    }
                    var chni = setInterval(chn, 100)

                    this.observer = new MutationObserver(
                        (event)=>{
                            const {removedNodes, addedNodes} = event[0];
                            const compabilityThemes = ['Horizontal-Server-List'];

                            ;([removedNodes, addedNodes]).forEach(
                                (changes, typeIndex)=>changes.forEach(
                                    (node) => {
                                        if(compabilityThemes.includes(node.id)) this.changeStyles();
                                    }
                                )
                            )
                        }
                    )
                    this.observer.observe(document.getElementsByTagName("bd-themes")[0], {"childList": true})

                }

                stop() {
                    document.removeEventListener('keyup', this.BadSendingStyles);
                    var chn = ()=>{
                        var channels = document.getElementById('channels')
                        if(channels==null) return
                        channels.removeEventListener('scroll', this.channelsScroll)
                        channels.removeEventListener('mouseup', this.channelsScroll)
                        this.threadsWithChannels()
                        clearInterval(chni)
                    }
                    var chni = setInterval(chn, 100)
                    
                    PluginUtilities.removeStyle('Animations-main');
                    PluginUtilities.removeStyle('Animations-req');
                    PluginUtilities.removeStyle('Animations-count');

                    this.observer.disconnect()

                }

                onSwitch() {
                    var chn = ()=>{
                        var channels = document.getElementById('channels')
                        if(channels==null) return
                        channels.addEventListener('scroll', this.channelsScroll)
                        channels.addEventListener('mouseup', this.channelsScroll)
                        this.threadsWithChannels()
                        clearInterval(chni)
                    }
                    var chni = setInterval(chn, 100)
                }
            }
        };
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();