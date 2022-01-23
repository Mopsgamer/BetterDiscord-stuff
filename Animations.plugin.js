/**
 * @name Animations
 * @version 1.2.3
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
            version: '1.2.3',
            description: 'This plugin is designed to animate different objects (lists, buttons, panels, etc.) with the ability to set delays, durations, types and sequences of these animations.',
            github: 'https://github.com/Mopsgamer/Animations/blob/main/Animations.plugin.js',
            github_raw: 'https://raw.githubusercontent.com/Mopsgamer/Animations/main/Animations.plugin.js',
        },
        changelog: [
            { "title": "New Stuff", "items": ["Template button for the editor."] },
            { "title": "Improvements", "type": "improved", "items": ["Changed the editor's font."] },
            //{ "title": "Fixes", "type": "fixed", "items": ["Buttons delay setting."] }
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
                { Logger, Patcher, Settings, ReactComponents } = Library;

            return class Animations extends Plugin {

                constructor() {
                    super();

                    this.defaultSettings = {
                        panelFix: true,
                        lists: {
                            enabled: true,
                            name: 'slide-up',
                            page: 0,
                            sequence: 'fromFirst',
                            custom: {
                                enabled: false,
                                frames: ['', '', '', ''],
                                page: 0
                            },
                            duration: 0.3,
                            delay: 0.04,
                            limit: 60
                        },
                        messages: {
                            enabled: true,
                            name: 'slide-right',
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
                            name: 'in',
                            page: 0,
                            sequence: 'fromLast',
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

                get countStyles() {
                    let result = '';

                    var selectorsLists = [
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
                        '.listItem-3SmSlK',
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
                        '.bd-addon-card > div',
                        /*alert elements*/
                        '.focusLock-2tveLW .scrollerBase-_bVAAt:not(.bd-addon-modal-settings) > div',
                        '.templatesList-uohY49 > *',
                        /*public servers*/
                        '.guildList-3GXKvP > .loaded-igpmmx'
                    ]

                    var selectorsButtons = [
                        /*chat input buttons*/
                        '.actionButtons-2vEOUh button',
                        /*voice opened buttons*/
                        '.buttons-uaqb-5 > *',
                        /*toolbar*/
                        '.toolbar-3_r2xA > *',
                        '.children-3xh0VB > *',
                        '.tabBar-ra-EuL > .item-3mHhwr'
                    ]

                    let min = (a, b) => (a > b ? a : b)

                    selectorsLists.forEach(selector => { if(!this.settings.lists.enabled) return;
                        let count = min(document.querySelectorAll(selector).length, this.settings.lists.limit)

                        if (this.settings.lists.sequence == 'fromFirst') for (var i = 1; i < count + 1; i++) {
                            result += `${selector}:nth-child(${i}) `
                                + `{animation-delay: ${((i - 1) * this.settings.lists.delay).toFixed(2)}s}\n\n`
                        }
                        if (this.settings.lists.sequence == 'fromLast') for (var i = 1; i < count + 1; i++) {
                            result += `${selector}:nth-last-child(${i}) `
                                + `{animation-delay: ${((i - 1) * this.settings.lists.delay).toFixed(2)}s}\n\n`
                        }

                    })

                    selectorsButtons.forEach(selector => {

                        let count = 20

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
                    
                    for (var i = 0, threadsCount = 0; i < channelsListElements.length; i++) {
                        let children = channelsListElements[(this.settings.lists.sequence=="fromFirst"?i:channelsListElements.length-i-1)];
                        
                        if (children.classList.contains('containerDefault-YUSmu3')
                         || children.classList.contains('containerDefault-3TQ5YN')
                         || children.classList.contains('wrapper-NhbLHG')
                        ) {
                            if(removeAnimations) {
                                children.style.transform = 'none'
                            }
                            else {
                                children.style.animationDelay = `${((i+threadsCount) * this.settings.lists.delay).toFixed(2)}s`;
                                children.style.animationName = this.settings.lists.custom.enabled && this.settings.lists.custom.frames[this.settings.lists.custom.page].trim() != '' ? 'custom-lists' : this.settings.lists.name;
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
                            'skew-left',
                        ];

                        var sequences = [
                            'fromFirst',
                            'fromLast',
                        ];

                        (["lists", "messages", "buttons"]).forEach(type=>{
                            if (!names.includes(this.settings[type].name)) {
                                this.settings[type].name = this.defaultSettings[type].name;
                                PluginUtilities.saveSettings("Animations", this.settings);
                            }
                        });

                        (["lists", "buttons"]).forEach(type=>{
                            if (!sequences.includes(this.settings[type].sequence)) {
                                this.settings[type].sequence = this.defaultSettings[type].sequence;
                                PluginUtilities.saveSettings("Animations", this.settings);
                            }
                        });

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

                /*fix panel*/
                ${this.settings.panelFix ? `
                .root-g14mjS .marginBottom20-315RVT {
                    padding: 0 10px 0 5px;
                }

                .plugin-input-group h2 {
                    margin-bottom: 30px;
                }
                ` : '/*disabled*/'}

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

                /*active threads button*/
                .wrapper-NhbLHG,
                /*threads button > list*/
                .container-2rzKKA,
                /*search*/
                .searchResultGroup-1lU_-i,
                /*members*/
                .member-2gU6Ar:not(.placeholder-1WgmVn),
                /*member-groups*/
                h2.membersGroup-2eiWxl,
                /*servers*/
                .listItem-3SmSlK,
                /*friends*/
                .peopleListItem-u6dGxF,
                /*channels*/
                .channel-1Shao0,
                .privateChannelsHeaderContainer-1UWASm,
                /*discovery categories*/
                .categoryItem-Kc_HK_,
                /*discord settings list*/
                .side-2ur1Qk *,
                /*discord settings*/
                main.contentColumnDefault-3eyv5o > div:not(#bd-editor-panel):not(.bd-controls):not(.bd-empty-image-container):not(.bd-addon-list):not(.bd-settings-group) > div:first-child > *:not(.image-141SOA),
                main.contentColumnDefault-3eyv5o > div:not(#bd-editor-panel):not(.bd-controls):not(.bd-empty-image-container):not(.bd-addon-list):not(.bd-settings-group) > div:not(.bd-settings-group):not(:first-child),
                main.contentColumnDefault-3eyv5o > div:not(#bd-editor-panel):not(.bd-controls):not(.bd-empty-image-container):not(.bd-addon-list):not(.bd-settings-group) > h2,
                .bd-addon-card,
                .bd-addon-card > div,
                /*alert elements*/
                .focusLock-2tveLW .scrollerBase-_bVAAt:not(.bd-addon-modal-settings) > div,
                .templatesList-uohY49 > *,
                /*public servers*/
                .guildList-3GXKvP > .loaded-igpmmx
                {
                    transform: scaleX(0);
                    animation-name: ${this.settings.lists.custom.enabled && this.settings.lists.custom.frames[this.settings.lists.custom.page].trim() != '' ? 'custom-lists' : this.settings.lists.name};
                    animation-fill-mode: forwards;
                    animation-duration: ${this.settings.lists.duration}s;
                }
                `}

                ${!this.settings.messages.enabled ? '' : `
                /* messages */
                .messageListItem-ZZ7v6g > .message-2CShn3
                {
                    transform: scale(0);
                    animation-fill-mode: forwards;
                    animation-name: ${this.settings.messages.custom.enabled && this.settings.messages.custom.frames[this.settings.messages.custom.page].trim() != '' ? 'custom-messages' : this.settings.messages.name};
                    animation-duration: ${this.settings.messages.duration}s;
                }

                /*lines-forward-messages fix*/
                .divider-IqmEqJ {z-index: 0}
                `}

                ${!this.settings.buttons.enabled ? '' : `
                /*chat input buttons*/
                .actionButtons-2vEOUh button,
                /*voice opened buttons*/
                .buttons-uaqb-5 > *,
                /*toolbar*/
                .toolbar-3_r2xA > *,
                .children-3xh0VB > *,
                .tabBar-ra-EuL > .item-3mHhwr
                {
                    transform: scaleX(0);
                    animation-name: ${this.settings.buttons.custom.enabled && this.settings.buttons.custom.frames[this.settings.buttons.custom.page].trim() != '' ? 'custom-buttons' : this.settings.buttons.name};
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
                    PluginUtilities.addStyle('Animations-main', this.styles);

                    PluginUtilities.removeStyle('Animations-count');
                    PluginUtilities.addStyle('Animations-count', this.countStyles);

                    this.threadsWithChannels()
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

                getSettingsPanel() {

                    var ButtonsPanel = (label, options = []) => {
                        var buttons = [];
                        options.forEach(option => {
                            var colorClass;
                            switch (option.color) {
                                case 'blurple':
                                    colorClass = 'colorBrand-I6CyqQ'
                                    break;
                                case 'red':
                                    colorClass = 'colorRed-rQXKgM'
                                    break;
                                case 'gray': case 'grey':
                                    colorClass = 'colorGrey-2iAG-B'
                                    break;
                                case 'green':
                                    colorClass = 'colorGreen-3y-Z79'
                                    break;
                                case 'link':
                                    colorClass = 'lookLink-15mFoz colorPrimary-2AuQVo'
                                    break;
                                case 'bd':
                                    colorClass = 'bd-button'
                                    break;

                                default:
                                    colorClass = 'bd-button'
                                    break;
                            }

                            buttons.push([
                                BdApi.React.createElement('button', {
                                    style: {
                                        display: 'inline-block',
                                        width: option.width ?? 'fit-content',
                                        padding: option.padding ?? '4px 8px',
                                        margin: '4px 8px'

                                    },
                                    hint: option.hint,
                                    id: option.id,
                                    class: `button-f2h6uQ sizeSmall-wU2dO- ${(option.color!='link'?'lookFilled-yCfaCM':'')} ${colorClass}`,
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
                                    class: 'buttonsPanel'
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
                                    class: `animPreview ${value == template.value ? 'enabled' : ''} preview-rua1rr group-spacing-16 cardPrimaryOutline-1ofwVz card-16VQ8C`,
                                    onClick: (e) => {
                                        onclick({value: template.value, page: openedPage});

                                        var sections = document.querySelectorAll(`[data-type="${options.type}"] .animPreview`);
                                        for (i = 0; i < sections.length; i++) sections[i].classList.remove('enabled');
                                        e.currentTarget.classList.add('enabled');
                                    }
                                },
                                    [...tempBlocks, BdApi.React.createElement('div', {
                                        class: 'animPreviewLabel'
                                    }, template.label
                                    )]
                                )
                            )
                        })

                        for (containersCount = 0; containersCount+1 <= Math.ceil(previewsTemp.length / previewsCountOnPage); containersCount++) {
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
                                    containersCount+1
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
                                        class: `animPreviewsContainer ${(options.custom)?(!this.settings[options.class].custom.enabled && openedPage == containersCount ?'show':''):(openedPage == containersCount?'show':'')} ${previewsTemp.length < previewsCountOnPage + 1 ? 'compact' : ''}`,
                                    },
                                    pages
                                )
                            );

                        }

                        if (options.custom) {

                            for (var i = 0; i < 4; i++) {
                                textareas.push(
                                    BdApi.React.createElement('textarea',
                                        {
                                            type: 'text',
                                            placeholder: '/*\nAnimated elements have scale(0) in the transformation,\nso your animation must contain scale(1) on the final frame(100%).\n*/\n\n0% {\n\ttransform: translate(0, 100%);\n}\n\n100% {\n\ttransform: translate(0, 0) scale(1);\n}',
                                            class: `customKeyframeTextArea inputDefault-3FGxgL input-2g-os5 textArea-3WXAeD scrollbarDefault-2w-Dyz scrollbar-3vVt8d ${this.settings[options.class].custom.enabled && i == this.settings[options.class].custom.page ?'show':''}`,
                                            onChange: (e)=>{
                                                var textarea = e.currentTarget;
                                                var value = e.currentTarget.value;
                                                if(this.isValidCSS(value) || value == "") {
                                                    textarea.classList.add('valid');
                                                    textarea.classList.remove('invalid');
                                                    this.settings[options.class].custom.frames[this.settings[options.class].custom.page] = value;
                                                    PluginUtilities.saveSettings("Animations", this.settings);
                                                    this.changeStyles()
                                                } else {
                                                    textarea.classList.add('invalid');
                                                    textarea.classList.remove('valid');
                                                }

                                                options.custom.onchange(e)
                                            }
                                        },
                                        options.custom.data.frames[i]
                                    )
                                );

                                swipeButtonsCustom.push(
                                    BdApi.React.createElement('div',
                                        {
                                            class: `animPageCircleButton ${this.settings[options.class].custom.page == i ? 'enabled' : ''}`,
                                            'data-page': i,
                                            onClick: (e) => {
                                                for (var containerElem of e.currentTarget.closest('.animPreviewsPanel').querySelectorAll(`.animPreviewsContainer, .customKeyframeTextArea`)) containerElem.classList.remove('show');

                                                e.currentTarget.closest('.animPreviewsPanel').querySelectorAll(`.customKeyframeTextArea`)[e.currentTarget.getAttribute('data-page')].classList.add('show');

                                                var sections = document.querySelectorAll(`[data-type="${options.type}"] .custom .animPageCircleButton`);
                                                for (i = 0; i < sections.length; i++) sections[i].classList.remove('enabled');

                                                e.currentTarget.classList.add('enabled');

                                                this.settings[options.class].custom.page = Number(e.currentTarget.getAttribute('data-page'));
                                            }
                                        },
                                        i+1
                                    )
                                );
                            };

                            swipeButtonsCustom.push(
                                BdApi.React.createElement('div',
                                    {
                                        class: `animPageCircleButton`,
                                        onClick: (e) => {
                                            e.currentTarget.closest('.animPreviewsPanel').querySelector(`.customKeyframeTextArea.show`).value
                                            = `0% {\n\ttransform: translate(0, 100%);\n}\n\n100% {\n\ttransform: translate(0, 0) scale(1);\n}`;
    
                                            this.settings[options.class].custom.frames[this.settings[options.class].custom.page]
                                            = `0% {\n\ttransform: translate(0, 100%);\n}\n\n100% {\n\ttransform: translate(0, 0) scale(1);\n}`;

                                            PluginUtilities.saveSettings("Animations", this.settings);
                                            this.changeStyles()
                                        }
                                    },
                                    'template'
                                )
                            );
                        }

                        var build = BdApi.React.createElement('div',
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
                                                var all = panel.querySelectorAll(`.animPreviewsContainer, .customKeyframeTextArea`)
                                                all.forEach(elem => elem.classList.remove('show'));
                                                if (this.settings[options.class].custom.enabled) {
                                                    e.currentTarget.classList.add('editing')
                                                    e.currentTarget.classList.remove('selecting')
                                                    panel.getElementsByClassName(`customKeyframeTextArea`)[this.settings[options.class].custom.page].classList.add('show');
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
                                                        style: {fill: "none"},
                                                        d: "M0 0h24v24H0z"
                                                    }),
                                                    BdApi.React.createElement("path", {
                                                        d: options.horizontal?"M 4 18 h 17 v -3 H 4 v 3 z M 4 10 v 3 h 17 v -3 h -17 M 4 5 v 3 h 17 V 5 H 4 z":"M4 11h5V5H4v6zm0 7h5v-6H4v6zm6 0h5v-6h-5v6zm6 0h5v-6h-5v6zm-6-7h5V5h-5v6zm6-6v6h5V5h-5z"
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
                                            class: `animPageButtons default ${options.custom?(!this.settings[options.class].custom.enabled?'show':''):'show'}`,
                                        },
                                        swipeButtonsDefault
                                    ) : null,
                                    BdApi.React.createElement('div',
                                        {
                                            class: `animPageButtons custom ${options.custom?(this.settings[options.class].custom.enabled?'show':''):'show'}`,
                                        },
                                        swipeButtonsCustom
                                    ),
                            ])


                        class Panel extends BdApi.React.Component {
                            render() {
                                return build
                            }
                        }

                        return Panel;
                    }

                    return Settings.SettingPanel.build(
                        this.saveSettings.bind(this),

                        new Settings.SettingField('Мain', null, () => { },
                            ButtonsPanel(null, [
                                {
                                    hint: 'turtle',
                                    color: 'blurple',
                                    label: 'Reset settings',
                                    id: 'reset-animations-settings',
                                    onclick: (e) => {
                                        let button = document.getElementById('reset-animations-settings');
                                        PluginUtilities.saveSettings("Animations", this.defaultSettings);
                                        this.settings = PluginUtilities.loadSettings("Animations", this.defaultSettings);
                                        this.changeStyles();
                                        button.innerText = 'Reseting...';
                                        this.closeSettings();
                                    }
                                },
                                {
                                    color: this.settings.panelFix ? 'green' : 'red',
                                    label: 'Spaces',
                                    id: 'animations-fix-this-window',
                                    onclick: (e) => {

                                        let button = document.getElementById('animations-fix-this-window')

                                        this.settings.panelFix = !this.settings.panelFix;
                                        if (this.settings.panelFix) {
                                            button.classList.remove('colorRed-rQXKgM')
                                            button.classList.add('colorGreen-3y-Z79')
                                        } else {
                                            button.classList.remove('colorGreen-3y-Z79')
                                            button.classList.add('colorRed-rQXKgM')
                                        }
                                        PluginUtilities.saveSettings("Animations", this.settings);
                                        this.changeStyles();
                                    }
                                },
                                {
                                    color: 'gray',
                                    label: 'Update',
                                    id: 'animations-version-check',
                                    onclick: (e) => {
                                        let button = document.getElementById('animations-version-check');
                                        const Http = new XMLHttpRequest();
                                        Http.open("GET", 'https://api.github.com/repos/Mopsgamer/BetterDiscord-codes/contents/plugins/Animations/Animations.plugin.js');
                                        Http.send();

                                        Http.onreadystatechange = (e) => {
                                            if(e.currentTarget.readyState != 4) return
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
                                                    button.classList.remove('colorBrand-I6CyqQ', 'colorRed-rQXKgM', 'colorGrey-2iAG-B')
                                                    button.classList.add('colorGreen-3y-Z79')
                                                    button.addEventListener('click',
                                                        ()=>{
                                                            BdApi.showConfirmationModal('Your version is older',
                                                            [
                                                                `v${config.info.version} (your)  →  v${GitHubVersion} (github)`,
                                                                BdApi.React.createElement('span', {style: {color: '#3ba55d', 'text-transform': 'uppercase'}}, 'The plugin will be updated.')
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
                                                    button.classList.remove('colorGrey-2iAG-B', 'colorRed-rQXKgM', 'colorGreen-3y-Z79')
                                                    button.classList.add('colorBrand-I6CyqQ')
                                                    button.addEventListener('click',
                                                        ()=>{
                                                            BdApi.showConfirmationModal('Your version is newer',
                                                            [
                                                                `v${config.info.version} (your)  →  v${GitHubVersion} (github)`,
                                                                BdApi.React.createElement('span', {style: {color: '#ed4245', 'text-transform': 'uppercase'}}, 'The plugin will be downdated.')
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
                                                    button.classList.remove('colorBrand-I6CyqQ', 'colorRed-rQXKgM', 'colorGreen-3y-Z79')
                                                    button.classList.add('colorGrey-2iAG-B')
                                                    button.addEventListener('click',
                                                        ()=>{
                                                            BdApi.showConfirmationModal('Your version is latest',
                                                            [
                                                                `v${config.info.version} (your)  ↔  v${GitHubVersion} (github)`,
                                                                BdApi.React.createElement('span', {style: {color: '#faa81a', 'text-transform': 'uppercase'}}, 'The plugin will be restored.')
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
                            ])
                        ),

                        new Settings.SettingField('Switching animations for element groups', null, () => { },
                            ButtonsPanel(null, [
                                {
                                    color: this.settings.lists.enabled ? 'green' : 'red',
                                    label: 'Lists',
                                    id: 'lists-enable-button',
                                    onclick: (e) => {

                                        let button = document.getElementById('lists-enable-button')

                                        this.settings.lists.enabled = !this.settings.lists.enabled;
                                        if (!this.settings.lists.enabled) {
                                            button.classList.remove('colorGreen-3y-Z79')
                                            button.classList.add('colorRed-rQXKgM')
                                        } else {
                                            button.classList.remove('colorRed-rQXKgM')
                                            button.classList.add('colorGreen-3y-Z79')
                                        }
                                        PluginUtilities.saveSettings("Animations", this.settings);
                                        this.changeStyles();
                                    }
                                },
                                {
                                    color: this.settings.messages.enabled ? 'green' : 'red',
                                    label: 'Messages',
                                    id: 'messages-enable-button',
                                    onclick: (e) => {

                                        let button = document.getElementById('messages-enable-button')

                                        this.settings.messages.enabled = !this.settings.messages.enabled;
                                        if (!this.settings.messages.enabled) {
                                            button.classList.remove('colorGreen-3y-Z79')
                                            button.classList.add('colorRed-rQXKgM')
                                        } else {
                                            button.classList.remove('colorRed-rQXKgM')
                                            button.classList.add('colorGreen-3y-Z79')
                                        }
                                        PluginUtilities.saveSettings("Animations", this.settings);
                                        this.changeStyles();
                                    }
                                },
                                {
                                    color: this.settings.buttons.enabled ? 'green' : 'red',
                                    label: 'Buttons',
                                    id: 'buttons-enable-button',
                                    onclick: (e) => {

                                        let button = document.getElementById('buttons-enable-button')

                                        this.settings.buttons.enabled = !this.settings.buttons.enabled;
                                        if (!this.settings.buttons.enabled) {
                                            button.classList.remove('colorGreen-3y-Z79')
                                            button.classList.add('colorRed-rQXKgM')
                                        } else {
                                            button.classList.remove('colorRed-rQXKgM')
                                            button.classList.add('colorGreen-3y-Z79')
                                        }
                                        PluginUtilities.saveSettings("Animations", this.settings);
                                        this.changeStyles();
                                    }
                                }
                            ])
                        ),

                        new Settings.SettingGroup('Lists').append(

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
                                    type: 'lists-name',
                                    class: 'lists',
                                    custom: {
                                        data: this.settings.lists.custom,
                                        onchange: (e) => { }
                                    }
                                },
                                this.settings.lists.name, (e) => {
                                    this.settings.lists.name = e.value;
                                    this.settings.lists.page = e.page;
                                    PluginUtilities.saveSettings("Animations", this.settings);
                                    this.changeStyles()
                                }),
                                { noteOnTop: true }
                            ),

                            new Settings.SettingField('Sequence', `[default ${this.defaultSettings.lists.sequence}] The sequence in which the list items are built.`, () => { },
                                PreviewsPanel([
                                    { label: '↓', value: 'fromFirst' },
                                    { label: '↑', value: 'fromLast' },
                                ], {
                                    type: 'lists-sequence'
                                }, this.settings.lists.sequence, (e) => {
                                    this.settings.lists.sequence = e.value;
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
                                    type: 'messages-name',
                                    class: 'messages',
                                    custom: {
                                        data: this.settings.messages.custom,
                                        onchange: (e) => { }
                                    }
                                },
                                this.settings.messages.name, (e) => {
                                    this.settings.messages.name = e.value;
                                    this.settings.messages.page = e.page;
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

                        ),

                        new Settings.SettingGroup('Buttons').append(

                            new Settings.SettingField('Name', `[default ${this.defaultSettings.buttons.name}] The name of the animation of the buttons when they appear.`, () => { },
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
                                    type: 'buttons-name',
                                    class: 'buttons',
                                    horizontal: true,
                                    custom: {
                                        data: this.settings.buttons.custom,
                                        onchange: (e) => { }
                                    }
                                },
                                this.settings.buttons.name, (e) => {
                                    this.settings.buttons.name = e.value;
                                    this.settings.buttons.page = e.page;
                                    PluginUtilities.saveSettings("Animations", this.settings);
                                    this.changeStyles()
                                }),
                                { noteOnTop: true }
                            ),

                            new Settings.SettingField('Sequence', `[default ${this.defaultSettings.buttons.sequence}] The sequence in which the buttons are built.`, () => { },
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
                                }),
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
                        )
                    )
                }

                start() {
                    this.reqStyles =
                    `/*components*/

                    .animPreviewsPanel {
                        oveflow: hidden;
                    }

                    .animPreviewsContainer {
                        display: flex;
                        flex-wrap: wrap;
                        justify-content: space-evenly; 
                        align-content: space-evenly;
                        height: 0;
                        opacity: 0;
                        box-sizing: border-box;
                        border-radius: 3px;
                        overflow: hidden;
                        transition: 0.5s opacity;
                    }

                    .customKeyframeTextArea {
                        opacity: 0;
                        display: block;
                        padding: 0;
                        height: 0;
                        border: none;
                        transition: 0.2s opacity;
                        font-size: 0.875rem;
                        line-height: 1.125rem;
                        text-indent: 0;
                        white-space: pre-wrap;
                        font-family: Consolas, monospace;
                    }

                    .customKeyframeTextArea::placeholder {
                        font-family: Consolas, monopoly;
                    }

                    .customKeyframeTextArea.show {
                        opacity: 1;
                        padding: 10px;
                        height: 374px;
                        border: 1px solid var(--background-tertiary);
                    }

                    .customKeyframeTextArea.show:hover {
                        border-color: var(--deprecated-text-input-border-hover);
                        transition: 0.2s border;
                    }

                    .animPreviewsContainer.show {
                        opacity: 1;
                        border: 1px solid var(--background-tertiary);
                        height: 374px;
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
                        padding: 5px 10px;
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
                        background-color: var(--interactive-normal);
                    }

                    .horizontal .animPreview .animTempBlock {
                        width: 15%;
                        height: 26px;
                        margin: 4px;
                        border-radius: 3pt;
                        background-color: var(--interactive-normal);
                        display: inline-block;
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
                    }`

                    PluginUtilities.removeStyle('Animations-req');
                    setTimeout(() => {
                        PluginUtilities.addStyle('Animations-req', this.reqStyles)
                    }, 100);
                    this.changeStyles()

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