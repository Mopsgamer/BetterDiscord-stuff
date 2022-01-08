/**
 * @name Animations
 * @version 1.1.1
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
            version: '1.1.1',
            description: 'This plugin is designed to animate different objects (lists, buttons, panels, etc.) with the ability to set delays, durations, types and directions of these animations.',
            github: 'https://github.com/Mopsgamer/Animations/blob/main/Animations.plugin.js',
            github_raw: 'https://raw.githubusercontent.com/Mopsgamer/Animations/main/Animations.plugin.js',
        },
        changelog: [
            //{ "title": "New Stuff", "items": ["Threads are now animated along with the channels."] },
            //{ "title": "Improvements", "type": "improved", "items": ["Selecting/Editing button modified.", "There are 3 more buttons at the beginning to disable animation for certain groups of elements, and the toggles have been removed."] },
            { "title": "Fixes", "type": "fixed", "items": ["Fixed channels underloading."] }
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
                { DiscordSelectors, DiscordAPI, PluginUtilities, DOMTools, Modals, WebpackModules } = Api,
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
                            direction: 'downwards',
                            custom: {
                                enabled: false,
                                frames: ['', '', '', ''],
                                page: 0
                            },
                            duration: 0.3,
                            delay: 0.06,
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
                            delay: 0.06,
                            limit: 30
                        },
                        buttons: {
                            enabled: true,
                            name: 'in',
                            page: 0,
                            direction: 'right',
                            custom: {
                                enabled: false,
                                frames: ['', '', '', ''],
                                page: 0
                            },
                            duration: 0.3,
                            delay: 0.1
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
                        '.container-3iAQ-0',

                        '.container-2Pjhx-',
                        '.membersGroup-v9BXpm[data-index]',
                        '.peopleListItem-2nzedh',
                        '.header-2RyJ0Y',
                        '.side-8zPYf6 .item-PXvHYJ',
                        '.privateChannelsHeaderContainer-3NB1K1',
                        '.focusLock-Ns3yie .scrollerBase-289Jih:not(.bd-addon-modal-settings) > div'
                    ]

                    var selectorsButtons = [
                        '.actionButtons-14eAc_ button',
                        '.buttonContainer-2jgQ7w button',
                        '.toolbar-1t6TWx > *',
                        '.item-PXvHYJ'
                    ]

                    let min = function (a, b) { return a > b ? a : b }

                    selectorsLists.forEach(selector => { if(!this.settings.lists.enabled) return;
                        let count = min(document.querySelectorAll(selector).length, this.settings.lists.limit)

                        if (this.settings.lists.direction == 'downwards') for (var i = 1; i < count + 1; i++) {
                            result += `${selector}:nth-child(${i}) `
                                + `{animation-delay: ${((i - 1) * this.settings.lists.delay).toFixed(2)}s}\n\n`
                        }
                        if (this.settings.lists.direction == 'upwards') for (var i = 1; i < count + 1; i++) {
                            result += `${selector}:nth-last-child(${i}) `
                                + `{animation-delay: ${((i - 1) * this.settings.lists.delay).toFixed(2)}s}\n\n`
                        }

                    })

                    selectorsButtons.forEach(selector => {

                        let count = document.querySelectorAll(selector).length

                        if (this.settings.buttons.direction == 'right') for (var i = 1; i < count + 1; i++) {
                            result += `${selector}:nth-child(${i}) `
                                + `{animation-delay: ${((i - 1) * this.settings.buttons.delay).toFixed(2)}s}\n\n`
                        }
                        if (this.settings.buttons.direction == 'left') for (var i = 1; i < count + 1; i++) {
                            result += `${selector}:nth-last-child(${i}) `
                                + `{animation-delay: ${((i - 1) * this.settings.buttons.delay).toFixed(2)}s}\n\n`
                        }

                    })

                    return result;

                }

                threadsWithChannels = ()=>{
                    if(!this.settings.lists.enabled) return
                    var channelsListElements = document.querySelectorAll('#channels .content-3YMskv > [class]');
                    for (var i = 0, threadsCount = 0; i < channelsListElements.length; i++) {
                        let children = channelsListElements[i];
                        
                        if (children.classList.contains('containerDefault--pIXnN')
                         || children.classList.contains('containerDefault-3tr_sE')
                         || children.classList.contains('wrapper-2jXpOf')
                        ) {
                            children.style.animationDelay = `${((i+threadsCount) * this.settings.lists.delay).toFixed(2)}s`;
                            children.style.animationName = this.settings.lists.custom.enabled && this.settings.lists.custom.frames[this.settings.lists.custom.page].trim() != '' ? 'custom-lists' : this.settings.lists.name;
                        }

                        else if (children.classList.contains('container-3JKcAb')) {
                            var threadsForkElement = children.querySelector('.container-3JKcAb > svg');
                            var threadsListElements = children.querySelectorAll('.containerDefault--pIXnN');

                            threadsForkElement.style.animationDelay = `${((i+threadsCount) * this.settings.lists.delay).toFixed(2)}s`;
                            threadsForkElement.style.animationName = 'slide-right';

                            for (var j = 0; j < threadsListElements.length; j++) {
                                threadsCount += (j?1:0);
                                let thread = threadsListElements[j];
                                thread.style.animationDelay = `${((i+threadsCount) * this.settings.lists.delay).toFixed(2)}s`;
                                thread.style.animationName = this.settings.lists.custom.enabled && this.settings.lists.custom.frames[this.settings.lists.custom.page].trim() != '' ? 'custom-lists' : this.settings.lists.name;
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
                            'skew-left'
                        ]

                        var directions = [
                            'downwards',
                            'upwards',
                            'right',
                            'left'
                        ]

                        if (!names.includes(this.settings.lists.name)) {
                            this.settings.lists.name = this.defaultSettings.lists.name;
                            PluginUtilities.saveSettings("Animations", this.settings);
                        }

                        if (!directions.includes(this.settings.lists.direction)) {
                            this.settings.lists.direction = this.defaultSettings.lists.direction;
                            PluginUtilities.saveSettings("Animations", this.settings);
                        }

                        if (!names.includes(this.settings.messages.name)) {
                            this.settings.messages.name = this.defaultSettings.messages.name;
                            PluginUtilities.saveSettings("Animations", this.settings);
                        }

                        if (!names.includes(this.settings.buttons.name)) {
                            this.settings.buttons.name = this.defaultSettings.buttons.name;
                            PluginUtilities.saveSettings("Animations", this.settings);
                        }

                        if (!directions.includes(this.settings.buttons.direction)) {
                            this.settings.buttons.direction = this.defaultSettings.buttons.direction;
                            PluginUtilities.saveSettings("Animations", this.settings);
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

                        result +=
                            `[data-animation="downwards"]:hover .animTempBlock, [data-animation="upwards"]:hover .animTempBlock,`
                            + `[data-animation="right"]:hover .animTempBlock, [data-animation="left"]:hover .animTempBlock`
                            + `{animation-name: out; animation-duration: 0.3s;}\n\n`;
                        for (var i = 1; i < 5; i++) {
                            result += `[data-animation="downwards"] .animTempBlock:nth-child(${i}), [data-animation="right"] .animTempBlock:nth-child(${i})
                            {animation-delay:${((i - 1) * this.settings.lists.delay).toFixed(2)}s}\n\n`
                        }
                        for (var i = 1; i < 5; i++) {
                            result += `[data-animation="upwards"] .animTempBlock:nth-child(${2 * 2 + 1 - i}), [data-animation="left"] .animTempBlock:nth-child(${2 * 2 + 1 - i})
                            {animation-delay:${((i - 1) * this.settings.lists.delay).toFixed(2)}s}\n\n`
                        }

                        for (var i = 1; i < this.settings.messages.limit; i++) {
                            result += `.messageListItem-1-jvGY:nth-last-child(${i}) > .message-2qnXI6
                            {animation-delay:${((i - 1) * this.settings.messages.delay).toFixed(2)}s}\n`
                        }

                        return result;
                    })()

                    this.styles = `
                /*ANIMATED DISCORD*/

                /*fix panel*/
                ${this.settings.panelFix ? `
                .root-1gCeng {
                    max-height: 100%;
                }

                .root-1gCeng .marginBottom20-32qID7 {
                    padding: 0 10px 0 5px;
                }

                .plugin-input-group h2 {
                    margin-bottom: 30px;
                }
                ` : '/*disabled*/'}

                /*lists limit*/
                .side-8zPYf6 > :nth-child(n+${this.settings.lists.limit}),
                .content-3YMskv > :nth-child(n+${this.settings.lists.limit})
                {animation: none !important; transform: none !important}

                ${!this.settings.lists.enabled ? '' : `
                /* wawes */
                /*channels*/
                .containerDefault-3tr_sE,
                .containerDefault--pIXnN
                {
                    transform: scaleX(0);
                    animation-fill-mode: forwards;
                    animation-duration: ${this.settings.lists.duration}s;
                }

                /*active threads button*/
                .wrapper-2jXpOf,
                /*search*/
                .container-3iAQ-0,
                /*members*/
                .container-2Pjhx-,
                /*member-groups*/
                .membersGroup-v9BXpm[data-index],
                /*friends*/
                .peopleListItem-2nzedh,
                /*left-lists*/
                .header-2RyJ0Y, .channel-2QD9_O, .privateChannelsHeaderContainer-3NB1K1,
                /*discord settings list*/
                .side-8zPYf6 .item-PXvHYJ,
                /*alert elements*/
                .focusLock-Ns3yie .scrollerBase-289Jih:not(.bd-addon-modal-settings) > div
                {
                    transform: scaleX(0);
                    animation-name: ${this.settings.lists.custom.enabled && this.settings.lists.custom.frames[this.settings.lists.custom.page].trim() != '' ? 'custom-lists' : this.settings.lists.name};
                    animation-fill-mode: forwards;
                    animation-duration: ${this.settings.lists.duration}s;
                }
                `}

                ${!this.settings.messages.enabled ? '' : `
                /* messages */
                .messageListItem-1-jvGY > .message-2qnXI6
                {
                    transform: scale(0);
                    animation-fill-mode: forwards;
                    animation-name: ${this.settings.messages.custom.enabled && this.settings.messages.custom.frames[this.settings.messages.custom.page].trim() != '' ? 'custom-messages' : this.settings.messages.name};
                    animation-duration: ${this.settings.messages.duration}s;
                }

                /*lines-forward-messages fix*/
                .divider-JfaTT5 {z-index: 0}
                `}

                ${!this.settings.buttons.enabled ? '' : `
                /*actions buttons*/
                .actionButtons-14eAc_ button,
                /*voice opened buttons*/
                .buttonContainer-2jgQ7w button,
                /*toolbar*/
                .toolbar-1t6TWx > *,
                .topPill-30KHOu > .item-PXvHYJ
                {
                    transform: scaleX(0);
                    animation-name: ${this.settings.buttons.custom.enabled && this.settings.buttons.custom.frames[this.settings.buttons.custom.page].trim() != '' ? 'custom-buttons' : this.settings.buttons.name};
                    animation-fill-mode: forwards;
                    animation-duration: ${this.settings.buttons.duration}s;
                }
                `}

                /**Non-custom**/

                /*threads fork*/
                .container-3JKcAb > svg {
                    transform: scale(0);
                    transform-oringin: 100% 50%;
                    animation-timing-function: linear;
                    animation-duration: ${this.settings.lists.duration}s;
                    animation-fill-mode: forwards;
                }

                .video-1ptUNw {
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
                                BdApi.React.createElement('button', {
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

                        if(options.custom) if(this.settings[options.class].custom.enabled &&
                            !this.isValidCSS(this.settings[options.class].custom.frames[this.settings[options.class].custom.page])
                        ) {
                            this.settings.lists.custom.enabled = false;
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
                                    class: `animPreview ${value == template.value ? 'enabled' : ''} preview-2nSL_2 group-spacing-16 cardPrimaryOutline-29Ujqw card-3Qj_Yx`,
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
                                        class: `animPageCircleButton ${openedPage == containersCount ? 'enabled' : ''} title-3sZWYQ`,
                                        'data-page': containersCount,
                                        onClick: (e) => {
                                            for (var containerElem of e.currentTarget.closest('.animPreviewsPanel').querySelectorAll(`.animPreviewsContainer, .customTextArea`)) containerElem.classList.remove('show');
                                            e.currentTarget.closest('.animPreviewsPanel').querySelectorAll(`.animPreviewsContainer`)[e.currentTarget.getAttribute('data-page')].classList.add('show');

                                            var sections = document.querySelectorAll(`[data-type="${options.type}"] .default .animPageCircleButton`);
                                            for (i = 0; i < sections.length; i++) sections[i].classList.remove('enabled');
                                            e.currentTarget.classList.add('enabled');

                                            this.settings[options.class].page = e.currentTarget.getAttribute('data-page')
                                        }
                                    },
                                    containersCount+1)
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

                        if (options.custom) for (var i = 0; i < 4; i++) {
                            textareas.push(
                                BdApi.React.createElement('textarea',
                                    {
                                        type: 'text',
                                        placeholder: '/* your keyframe here */\n\n0% {\n\ttransform: translate(0, 100%)\n}\n\n100% {\n\ttransform: translate(0, 0)\n}',
                                        class: `customTextArea inputDefault-_djjkz input-cIJ7To textArea-1Lj-Ns scrollbarDefault-3COgCQ scrollbar-3dvm_9 ${this.settings[options.class].custom.enabled && i == this.settings[options.class].custom.page ?'show':''}`,
                                        onChange: options.custom.onchange
                                    },
                                    options.custom.data.frames[i]
                                )
                            );

                            swipeButtonsCustom.push(
                                BdApi.React.createElement('div',
                                    {
                                        class: `animPageCircleButton ${this.settings[options.class].custom.page == i ? 'enabled' : ''} title-3sZWYQ`,
                                        'data-page': i,
                                        onClick: (e) => {
                                            for (var containerElem of e.currentTarget.closest('.animPreviewsPanel').querySelectorAll(`.animPreviewsContainer, .customTextArea`)) containerElem.classList.remove('show');
                                            e.currentTarget.closest('.animPreviewsPanel').querySelectorAll(`.customTextArea`)[e.currentTarget.getAttribute('data-page')].classList.add('show');

                                            var sections = document.querySelectorAll(`[data-type="${options.type}"] .custom .animPageCircleButton`);
                                            for (i = 0; i < sections.length; i++) sections[i].classList.remove('enabled');
                                            e.currentTarget.classList.add('enabled');

                                            this.settings[options.class].custom.page = e.currentTarget.getAttribute('data-page');
                                        }
                                    },
                                    i+1)
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
                                                var all = panel.querySelectorAll(`.animPreviewsContainer, .customTextArea`)
                                                all.forEach(elem => elem.classList.remove('show'));
                                                if (this.settings[options.class].custom.enabled) {
                                                    e.currentTarget.classList.add('editing')
                                                    e.currentTarget.classList.remove('selecting')
                                                    panel.getElementsByClassName(`customTextArea`)[this.settings[options.class].custom.page].classList.add('show');
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

                                        BdApi.React.createElement('div', {class: 'switchActionButton'}, 'Selecting'),
                                        BdApi.React.createElement('div', {class: 'switchActionButton'}, 'Editing')
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

                        new Settings.SettingField('Settings panel', null, () => { },
                            ButtonsPanel(null, [
                                {
                                    color: 'blurple', label: 'Reset settings', id: 'reset-animations-settings', onclick: (e) => {
                                        let button = document.getElementById('reset-animations-settings');
                                        PluginUtilities.saveSettings("Animations", this.defaultSettings);
                                        this.settings = PluginUtilities.loadSettings("Animations", this.defaultSettings);
                                        this.changeStyles();
                                        button.innerText = 'Reseting...';
                                        this.closeSettings();
                                    }
                                },
                                {
                                    color: this.settings.panelFix ? 'red' : 'green', label: this.settings.panelFix ? 'Take this window back' : 'Fix this window', id: 'fix-this-window', onclick: (e) => {

                                        let button = document.getElementById('fix-this-window')

                                        this.settings.panelFix = !this.settings.panelFix;
                                        if (this.settings.panelFix) {
                                            button.classList.remove('colorGreen-29iAKY')
                                            button.classList.add('colorRed-1TFJan')
                                            button.innerText = 'Take this window back'
                                        } else {
                                            button.classList.remove('colorRed-1TFJan')
                                            button.classList.add('colorGreen-29iAKY')
                                            button.innerText = 'Fix this window'
                                        }
                                        PluginUtilities.saveSettings("Animations", this.settings);
                                        this.changeStyles();
                                    }
                                }
                            ])
                        ),

                        new Settings.SettingField('Switching animations for element groups', null, () => { },
                            ButtonsPanel(null, [
                                {
                                    color: this.settings.lists.enabled ? 'green' : 'red', label: 'Lists', id: 'lists-enable-button', onclick: (e) => {

                                        let button = document.getElementById('lists-enable-button')

                                        this.settings.lists.enabled = !this.settings.lists.enabled;
                                        if (!this.settings.lists.enabled) {
                                            button.classList.remove('colorGreen-29iAKY')
                                            button.classList.add('colorRed-1TFJan')
                                        } else {
                                            button.classList.remove('colorRed-1TFJan')
                                            button.classList.add('colorGreen-29iAKY')
                                        }
                                        PluginUtilities.saveSettings("Animations", this.settings);
                                        this.changeStyles();
                                    }
                                },
                                {
                                    color: this.settings.messages.enabled ? 'green' : 'red', label: 'Messages', id: 'messages-enable-button', onclick: (e) => {

                                        let button = document.getElementById('messages-enable-button')

                                        this.settings.messages.enabled = !this.settings.messages.enabled;
                                        if (!this.settings.messages.enabled) {
                                            button.classList.remove('colorGreen-29iAKY')
                                            button.classList.add('colorRed-1TFJan')
                                        } else {
                                            button.classList.remove('colorRed-1TFJan')
                                            button.classList.add('colorGreen-29iAKY')
                                        }
                                        PluginUtilities.saveSettings("Animations", this.settings);
                                        this.changeStyles();
                                    }
                                },
                                {
                                    color: this.settings.buttons.enabled ? 'green' : 'red', label: 'Buttons', id: 'buttons-enable-button', onclick: (e) => {

                                        let button = document.getElementById('buttons-enable-button')

                                        this.settings.buttons.enabled = !this.settings.buttons.enabled;
                                        if (!this.settings.buttons.enabled) {
                                            button.classList.remove('colorGreen-29iAKY')
                                            button.classList.add('colorRed-1TFJan')
                                        } else {
                                            button.classList.remove('colorRed-1TFJan')
                                            button.classList.add('colorGreen-29iAKY')
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
                                        onchange: (e) => {
                                            if(this.isValidCSS(e.currentTarget.value) || e.currentTarget.value=="") {
                                                e.currentTarget.classList.add('valid');
                                                e.currentTarget.classList.remove('invalid');
                                                this.settings.lists.custom.frames[this.settings.lists.custom.page] = e.currentTarget.value;
                                                PluginUtilities.saveSettings("Animations", this.settings);
                                                this.changeStyles()
                                            } else {
                                                e.currentTarget.classList.add('invalid');
                                                e.currentTarget.classList.remove('valid')
                                            }
                                        }
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
                                        onchange: (e) => {
                                            if(this.isValidCSS(e.currentTarget.value) || e.currentTarget.value=="") {
                                                e.currentTarget.classList.add('valid');
                                                e.currentTarget.classList.remove('invalid');
                                                this.settings.messages.custom.frames[this.settings.messages.custom.page] = e.currentTarget.value;
                                                PluginUtilities.saveSettings("Animations", this.settings);
                                                this.changeStyles()
                                            } else {
                                                e.currentTarget.classList.add('invalid');
                                                e.currentTarget.classList.remove('valid')
                                            }
                                        }
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
                                        onchange: (e) => {
                                            if(this.isValidCSS(e.currentTarget.value) || e.currentTarget.value=="") {
                                                e.currentTarget.classList.add('valid');
                                                e.currentTarget.classList.remove('invalid');
                                                this.settings.buttons.custom.frames[this.settings.buttons.custom.page] = e.currentTarget.value;
                                                PluginUtilities.saveSettings("Animations", this.settings);
                                                this.changeStyles()
                                            } else {
                                                e.currentTarget.classList.add('invalid');
                                                e.currentTarget.classList.remove('valid')
                                            }
                                        }
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

                            new Settings.SettingField('Direction', `[default ${this.defaultSettings.buttons.direction}] The direction in which the buttons are built.`, () => { },
                                PreviewsPanel([
                                    { label: 'Right', value: 'right' },
                                    { label: 'Left', value: 'left' }
                                ], {
                                    type: 'lists-direction',
                                    horizontal: true
                                }, this.settings.buttons.direction, (e) => {
                                    this.settings.buttons.direction = e;
                                    PluginUtilities.saveSettings("Animations", this.settings);
                                    this.changeStyles()
                                }),
                                { noteOnTop: true }
                            ),

                            new Settings.Slider('Delay', `[default ${this.defaultSettings.buttons.delay}] Delay before appearing for each button in seconds.`, 1, 10, this.settings.buttons.delay,
                                (e) => {
                                    this.settings.messages.delay = e;
                                    this.changeStyles()
                                }, {
                                markers: [0, 0.01, 0.02, 0.04, 0.06, 0.08, 0.1, 0.12, 0.15, 0.2],
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

                    /*.animPreviewsPanel {

                    }*/

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

                    .customTextArea {
                        opacity: 0;
                        display: block;
                        padding: 0;
                        height: 0;
                        border: none;
                        transition: 0.2s opacity;
                    }

                    .customTextArea.show {
                        opacity: 1;
                        padding: 10px;
                        height: 335px;
                        border: 1px solid var(--background-tertiary);
                    }

                    .customTextArea.show:hover {
                        border-color: black;
                        transition: 0.2s border;
                    }

                    .customTextArea.invalid {
                        color: #ed4245;
                    }

                    .animPreviewsContainer.show {
                        opacity: 1;
                        border: 1px solid var(--background-tertiary);
                        height: 335px;
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
                        border-color: black;
                    }

                    .switchActionButton {
                        width: 100px;
                        display: inline-block;
                        padding: 5px 10px;
                    }

                    .switchActionButton {
                        color: white;
                        transition: 0.2s background;
                        background-size: cover;
                        background: linear-gradient(90deg, transparent 0%, var(--brand-experiment) 0%, var(--brand-experiment) 100%, transparent 100%) no-repeat;
                    }

                    .selecting .switchActionButton:nth-child(1), .editing .switchActionButton:nth-child(2) {
                        background-position-x: 0;
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
                        border-left: 1px solid black;
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
                        padding: 5px 10px 25px 10px;
                        color: var(--interactive-normal);
                        text-align: center;
                        font-size: 18px;
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
                        border-color: black;
                    }

                    .animPageCircleButton.enabled {
                        color: white;
                        background-color: var(--brand-experiment);
                    }

                    .vertical .animPreview {
                        box-sizing: border-box;
                        width: 120px;
                        height: 145px;
                        padding: 5px;
                        display: inline-block;
                        transition: 0.2s;
                    }

                    .horizontal .animPreview {
                        box-sizing: border-box;
                        width: calc(100% - 16px);
                        height: 45px;
                        padding: 5px;
                        display: inline-block;
                        transition: 0.2s;
                    }

                    .horizontal .compact .animPreview {
                        margin: 5px 0;
                    }

                    .animPreview:hover {
                        border-color: black;
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
                    
                    .vertical .animPreview .animPreviewLabel {
                        position: absolute;
                        padding-left: 4px;
                        bottom: 6pt;
                        color: var(--interactive-normal);
                        font-size: 10pt;
                    }

                    .horizontal .animPreview .animPreviewLabel {
                        position: absolute;
                        padding-left: 4px;
                        bottom: 11pt;
                        right: 11pt;
                        color: var(--interactive-normal);
                        font-size: 10pt;
                    }

                    .animPreview.enabled .animPreviewLabel {
                        color: #fff;
                    }`

                    PluginUtilities.removeStyle('Animations-req');
                    setTimeout(() => {
                        PluginUtilities.addStyle('Animations-req', this.reqStyles)
                    }, 100);
                    this.changeStyles()

                    this.BadSendingStyles = (e)=>{
                        if(e.key=="Enter") { // finding parent
                            var BadSendingTextNode = document.querySelector('.isSending-9nvak6, .isFailed-2MPmD6')
                            if(!BadSendingTextNode) {
                                setTimeout(()=>{
                                    BadSendingTextNode = this.BadSendingStyles(e)
                                    return BadSendingTextNode
                                },50)// frequency of checks after pressing Enter
                            } else {
                            var result = BadSendingTextNode.closest('.message-2qnXI6');// this is where we found it
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
                        this.channelsScrollTimer = setTimeout(this.threadsWithChannels, 50);// scroll event delay
                    }
                    document.getElementById('channels').addEventListener('scroll', this.channelsScroll)
                }

                stop() {
                    document.removeEventListener('keyup', this.BadSendingStyles);
                    document.getElementById('channels').removeEventListener('scroll', this.channelsScroll);
                    PluginUtilities.removeStyle('Animations-main');
                    PluginUtilities.removeStyle('Animations-req');
                    PluginUtilities.removeStyle('Animations-count');
                }

                onSwitch() {
                    document.getElementById('channels').addEventListener('scroll', this.channelsScroll)
                    this.threadsWithChannels()
                }
            }
        };
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();