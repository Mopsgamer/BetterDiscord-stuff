/**
 * @name AnimationsPlugin
 * @version 1.3.5
 * @description This plugin is designed to animate different objects (lists, buttons, panels, etc.) with the ability to set delays, durations, types and sequences of these animations.
 * @author Mops
 * @authorLink https://github.com/Mopsgamer/
 * @authorId 538010208023347200
 * @website https://github.com/Mopsgamer/BetterDiscord-codes/tree/AnimationsPlugin
 * @source https://raw.githubusercontent.com/Mopsgamer/BetterDiscord-codes/AnimationsPlugin/AnimationsPlugin.plugin.js
 * @updateUrl https://raw.githubusercontent.com/Mopsgamer/BetterDiscord-codes/AnimationsPlugin/AnimationsPlugin.plugin.js
 */

module.exports = (
    () => {
        const config = {
            info: {
                name: 'Animations',
                authors: [
                    {
                        name: 'Mops',
                        discord_id: '538010208023347200',
                        github_username: 'Mopsgamer',
                    }
                ],
                version: '1.3.5',
                description: 'This plugin is designed to animate different objects (lists, buttons, panels, etc.) with the ability to set delays, durations, types and sequences of these animations.',
                github: 'https://github.com/Mopsgamer/AnimationsPlugin/blob/main/AnimationsPlugin.plugin.js',
                github_raw: 'https://raw.githubusercontent.com/Mopsgamer/AnimationsPlugin/main/AnimationsPlugin.plugin.js',
            },
            changelog: [
                //{ "title": "New Stuff", "items": ["Limits for lists have been removed."] },
                //{ "title": "Improvements", "type": "improved", "items": ["Now for the lists of members, channels, and servers animation is played once.", "The link to the server should now open without a browser."] },
                { "title": "Fixes", "type": "fixed", "items": ["A few fixes."] }
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
                const plugin = (Library) => {
                const { DiscordModules, DiscordAPI, PluginUtilities, PluginUpdater, DOMTools, Modals, WebpackModules } = Api
                const { Logger, Patcher, Settings, Tooltip, ReactComponents, ContextMenu } = ZeresPluginLibrary
                const { React, ReactDOM } = BdApi

                createElem = (...args) => { return React.createElement(...args); }

                return class AnimationsPlugin extends Plugin {

                    constructor() {
                        super();

                        this.defaultFrames = {
                            template: {
                                start: 'transform: scale(0);',
                                anim: '0% {\ntransform: translate(0, 100%);\n}\n\n100% {\ntransform: translate(0, 0) scale(1);\n}'
                            },
                            clear: {
                                start: '',
                                anim: ''
                            },
                        }

                        let defaultSettings = {
                            lists: {
                                enabled: true,
                                name: 'opacity',
                                page: 0,
                                sequence: 'fromFirst',
                                selectors: '',
                                custom: {
                                    enabled: false,
                                    frames: [
                                        {
                                            start: '',
                                            anim: ''
                                        },
                                        {
                                            start: '',
                                            anim: ''
                                        },
                                        {
                                            start: '',
                                            anim: ''
                                        },
                                    ],
                                    page: 0
                                },
                                duration: 0.4,
                                delay: 0.04,
                            },
                            buttons: {
                                enabled: true,
                                name: 'opacity',
                                page: 0,
                                sequence: 'fromLast',
                                selectors: '',
                                custom: {
                                    enabled: false,
                                    frames: [
                                        {
                                            start: '',
                                            anim: ''
                                        },
                                        {
                                            start: '',
                                            anim: ''
                                        },
                                        {
                                            start: '',
                                            anim: ''
                                        },
                                    ],
                                    page: 0
                                },
                                duration: 0.3,
                                delay: 0.2
                            },
                            messages: {
                                enabled: true,
                                name: 'opacity',
                                page: 0,
                                custom: {
                                    enabled: false,
                                    frames: [
                                        {
                                            start: '',
                                            anim: ''
                                        },
                                        {
                                            start: '',
                                            anim: ''
                                        },
                                        {
                                            start: '',
                                            anim: ''
                                        },
                                    ],
                                    page: 0
                                },
                                duration: 0.4,
                                delay: 0.04,
                                limit: 30
                            },
                            popouts: {
                                enabled: true,
                                name: 'opacity',
                                page: 0,
                                selectors: '',
                                custom: {
                                    enabled: false,
                                    frames: [
                                        {
                                            start: '',
                                            anim: ''
                                        },
                                        {
                                            start: '',
                                            anim: ''
                                        },
                                        {
                                            start: '',
                                            anim: ''
                                        },
                                    ],
                                    page: 0
                                },
                                duration: 0.5
                            }
                        }

                        /**@type defaultSettings */
                        this.defaultSettings = defaultSettings

                        /**@type defaultSettings */
                        this.settings = PluginUtilities.loadSettings(this.getName(), this.defaultSettings);
                    }

                    getName() { return config.info.name }
                    getAuthor() { return config.info.authors.map(a => a.name).join(', ') }
                    getDescription() { return config.info.description }
                    getVersion() { return config.info.version }

                    static selectorsLists = [
                        /*active threads button*/
                        `.${WebpackModules.getByProps('channelName', 'icon').wrapper}`,
                        /*threads button > list*/
                        `.${WebpackModules.getByProps('container', 'bullet').container}`,
                        /*search*/
                        `.${WebpackModules.getByProps('searchResultGroup').searchResultGroup}`,

                        /*members*/
                        //`.${WebpackModules.getByProps('botTag', 'member').member}:not([class*=placeholder])`,
                        /*member-groups*/
                        //`h2.${WebpackModules.getByProps('membersGroup').membersGroup}`

                        /*friends*/
                        `.${WebpackModules.getByProps('peopleListItem').peopleListItem}`,
                        /*discovery categories*/
                        `.${WebpackModules.getByProps('categoryItem').categoryItem}`,
                        /*discord settings list*/
                        `.${WebpackModules.getByProps('side').side} *`,
                        /*discord settings*/
                        `main.${WebpackModules.getByProps('contentColumnDefault').contentColumnDefault} > div:not(#bd-editor-panel):not(.bd-controls):not(.bd-empty-image-container):not(.bd-addon-list):not(.bd-settings-group) > div:first-child > *:not(.${WebpackModules.getByProps('image', 'desaturate').image})`,
                        `main.${WebpackModules.getByProps('contentColumnDefault').contentColumnDefault} > div:not(#bd-editor-panel):not(.bd-controls):not(.bd-empty-image-container):not(.bd-addon-list):not(.bd-settings-group) > div:not(.bd-settings-group):not(:first-child)`,
                        `main.${WebpackModules.getByProps('contentColumnDefault').contentColumnDefault} > div:not(#bd-editor-panel):not(.bd-controls):not(.bd-empty-image-container):not(.bd-addon-list):not(.bd-settings-group) > h2`,
                        `.bd-addon-card`,
                        /*alert elements*/
                        `.${WebpackModules.getByProps('focusLock').focusLock} .${WebpackModules.getByProps('scrollerBase', 'thin').scrollerBase}:not(.bd-addon-modal-settings) > div`,
                        /*public servers*/
                        `.${WebpackModules.getAllByProps('guildList', 'subtitle')[1].guildList} > .${WebpackModules.getByProps('loaded', 'card').loaded}`
                    ]

                    static selectorsButtons = [
                        /*chat input buttons*/
                        `.${WebpackModules.getByProps('actionButtons', 'wrapper').actionButtons} button`,
                        /*voice opened buttons*/
                        `.${WebpackModules.getByProps('buttons', 'focusRing').buttons} > *`,
                        /*toolbar*/
                        `.${WebpackModules.getByProps('toolbar', 'container').toolbar} > *`,
                        `.${WebpackModules.getByProps('toolbar', 'children').children} > *`,
                        `.${WebpackModules.getByProps('tabBar', 'peopleColumn').tabBar} > .${WebpackModules.getByProps('item', 'peopleColumn').item}`
                    ]

                    static selectorsPopouts = [
                        `[role="dialog"].${WebpackModules.getByProps('focusLock').focusLock} > *:not(.bd-addon-modal)`
                    ]

                    static names = [
                        'circle',
                        'polygon',
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

                    static modules = {
                        Button: WebpackModules.getByProps('button', 'sizeIcon')?.button,
                        ButtonSizeSmall: WebpackModules.getByProps('button', 'sizeIcon')?.sizeSmall,
                        ButtonText: WebpackModules.getByProps('buttonText', 'giftIcon')?.buttonText,
                        ButtonContents: WebpackModules.getByProps('button', 'contents').contents,
                        ContentThin: WebpackModules.getByProps('content', 'thin')?.content,
                        ContainerDefault: WebpackModules.getByProps('containerDefault')?.containerDefault,
                        ContainerDefaultSpaceBeforeCategory: WebpackModules.getByProps('containerDefault', 'spaceBeforeCategory')?.containerDefault,
                        ContainerSpine: WebpackModules.getByProps('container', 'spine')?.container,
                        Card: WebpackModules.getByProps('cardBrand')?.card,
                        RoundButton: WebpackModules.getByProps('roundButton').roundButton,
                        CodeRedemptionRedirect: WebpackModules.getByProps('codeRedemptionRedirect')?.codeRedemptionRedirect ?? 'codeRedemptionRedirect-2hYMSQ',
                        ChatContent: WebpackModules.getByProps('chatContent')?.chatContent,
                        DividerReplying: WebpackModules.getByProps('divider', 'replying')?.divider,
                        InputDefault: WebpackModules.getByProps('inputDefault', 'focused')?.inputDefault,
                        IsSending: WebpackModules.getByProps('isSending')?.isSending,
                        IsFailed: WebpackModules.getByProps('isFailed')?.isFailed,
                        Message: WebpackModules.getByProps('message')?.message,
                        MessageListItem: WebpackModules.getByProps('messageListItem')?.messageListItem,
                        Member: WebpackModules.getByProps('botTag', 'member').member,
                        MembersGroup: WebpackModules.getByProps('membersGroup').membersGroup,
                        Side: WebpackModules.getByProps('side')?.side,
                        ScrollbarDefault: WebpackModules.getByProps('scrollbarDefault')?.scrollbarDefault,
                        TextArea: WebpackModules.getByProps('textArea')?.textArea,
                        Offline: WebpackModules.getByProps('offline')?.offline,
                        GuildsSidebar: WebpackModules.getByProps('guilds', 'sidebar')?.guilds,
                        WrapperTypeThread: WebpackModules.getByProps('wrapper', 'typeThread')?.wrapper,
                        VideoLead: WebpackModules.getByProps('video', 'lead')?.video
                    }

                    animateChannels = (removeAnimations = false) => {

                        if (!this.settings.lists.enabled) return;
                        var channelsListElements = document.querySelectorAll(`#channels .${AnimationsPlugin.modules.ContentThin} > [class]`);
                        var count = channelsListElements?.length ?? 40;

                        if (channelsListElements?.length == 1) return setTimeout(() => this.animateChannels(), 100);

                        PluginUtilities.addStyle(`${this.getName()}-channelslist`,
                            `/*channels*/
                            .${AnimationsPlugin.modules.ContainerDefaultSpaceBeforeCategory},
                            .${AnimationsPlugin.modules.ContainerDefault}
                            {
                                ${this.settings.lists.custom.frames[this.settings.lists.custom.page]?.start ? this.settings.lists.custom.frames[this.settings.lists.custom.page]?.start : `transform: scale(0);`}
                                animation-fill-mode: forwards;
                                animation-duration: ${this.settings.lists.duration}s;
                            }
                        `)

                        for (var i = 0, threadsCount = 0; i < count; i++) {
                            let children = channelsListElements[(this.settings.lists.sequence == "fromFirst" ? i : count - i - 1)];
                            if (!children) return;

                            if (children.classList.contains(AnimationsPlugin.modules.ContainerDefault)
                                || children.classList.contains(AnimationsPlugin.modules.ContainerDefaultSpaceBeforeCategory)
                                || children.classList.contains(AnimationsPlugin.modules.WrapperTypeThread)
                            ) {
                                if (removeAnimations) {
                                    children.style.transform = 'none'
                                }
                                else {
                                    children.style.animationDelay = `${((i + threadsCount) * this.settings.lists.delay).toFixed(2)}s`;
                                    children.style.animationFillMode = 'forwards';
                                    children.style.animationName = this.settings.lists.custom.enabled &&
                                        (this.settings.lists.custom.page >= 0 ?
                                            this.settings.lists.custom.frames[this.settings.lists.custom.page]?.anim?.trim?.() != '' &&
                                            this.isValidKeyframe(this.settings.lists.custom.frames[this.settings.lists.custom.page]?.anim)
                                            : 0)
                                        ? 'custom-lists' : this.settings.lists.name;
                                }
                            }

                            else if (children.classList.contains(AnimationsPlugin.modules.ContainerSpine)) {
                                var threadsForkElement = children.querySelector(`.${AnimationsPlugin.modules.ContainerSpine} > svg`);
                                var threadsListElements = children.querySelectorAll(`.${AnimationsPlugin.modules.ContainerDefault}`);

                                threadsForkElement.style.animationDelay = `${((i + threadsCount) * this.settings.lists.delay).toFixed(2)}s`;
                                threadsForkElement.style.animationName = 'slide-right';

                                for (var j = 0; j < threadsListElements.length; j++) {
                                    threadsCount += (j ? 1 : 0);
                                    let thread = threadsListElements[(this.settings.lists.sequence == "fromFirst" ? j : threadsListElements.length - j - 1)];
                                    if (removeAnimations) {
                                        thread.style.transform = 'none'
                                    }
                                    else {
                                        thread.style.animationDelay = `${((i + threadsCount) * this.settings.lists.delay).toFixed(2)}s`;
                                        children.style.animationFillMode = 'forwards';
                                        thread.style.animationName = this.settings.lists.custom.enabled &&
                                            (this.settings.lists.custom.page >= 0 ? this.settings.lists.custom.frames[this.settings.lists.custom.page]?.anim?.trim?.() : 0) != ''
                                            ? 'custom-lists' : this.settings.lists.name;
                                    }
                                }
                            }

                        }

                        setTimeout(() => PluginUtilities.removeStyle(`${this.getName()}-channelslist`), (count * this.settings.lists.delay) + this.settings.lists.duration)

                    }

                    animateMembers = (removeAnimations = false) => {

                        if (!this.settings.lists.enabled) return;

                        var membersListElements = document.querySelectorAll(`.${AnimationsPlugin.modules.Member}:not([class*=placeholder]), h2.${AnimationsPlugin.modules.MembersGroup}`);
                        var count = membersListElements?.length ?? 40;

                        if (membersListElements?.length == 1) return setTimeout(() => this.animateMembers(), 100);

                        PluginUtilities.addStyle(`${this.getName()}-memberslist`,
                            `/*members*/
                        .${AnimationsPlugin.modules.Member}:not([class*=placeholder]),
                        /*member-groups*/
                        h2.${AnimationsPlugin.modules.MembersGroup}
                        {
                            ${this.settings.lists.custom.frames[this.settings.lists.custom.page]?.start ? this.settings.lists.custom.frames[this.settings.lists.custom.page]?.start : `transform: scale(0);`}
                            animation-fill-mode: forwards;
                            animation-duration: ${this.settings.lists.duration}s;
                        }

                        /* members offline */
                        .${AnimationsPlugin.modules.Offline}
                        {
                            animation-name: ${this.settings.lists.name}_offline !important;
                        }
                    `)

                        for (var i = 0; i < count; i++) {
                            let children = membersListElements[(this.settings.lists.sequence == "fromFirst" ? i : count - i - 1)];
                            if (!children) return;

                            if (removeAnimations) {
                                children.style.transform = 'none'
                            }
                            else {

                                children.style.animationDelay = `${(i * this.settings.lists.delay).toFixed(2)}s`;
                                children.style.animationFillMode = 'forwards';
                                children.style.animationName = this.settings.lists.custom.enabled &&
                                    (this.settings.lists.custom.page >= 0 ?
                                        this.settings.lists.custom.frames[this.settings.lists.custom.page]?.anim?.trim?.() != '' &&
                                        this.isValidKeyframe(this.settings.lists.custom.frames[this.settings.lists.custom.page]?.anim)
                                        : 0)
                                    ? 'custom-lists' : this.settings.lists.name;
                            }
                        }

                        setTimeout(() => PluginUtilities.removeStyle(`${this.getName()}-memberslist`), (count * this.settings.lists.delay) + this.settings.lists.duration)

                    }

                    animateServers = (removeAnimations = false) => {

                        if (!this.settings.lists.enabled) return;

                        var serversListElements = document.querySelectorAll(`#app-mount .${AnimationsPlugin.modules.GuildsSidebar} [class*="listItem"]:not([class*="listItemWrapper"])`);
                        var count = serversListElements?.length ?? 40;

                        PluginUtilities.addStyle(`${this.getName()}-serverslist`,
                            `/*servers*/
                        #app-mount .${AnimationsPlugin.modules.GuildsSidebar} [class*="listItem"]:not([class*="listItemWrapper"])
                        {
                            ${this.settings.lists.custom.frames[this.settings.lists.custom.page]?.start ? this.settings.lists.custom.frames[this.settings.lists.custom.page]?.start : `transform: scale(0);`}
                            animation-fill-mode: forwards;
                            animation-duration: ${this.settings.lists.duration}s;
                        }

                        ${!BdApi.Themes.isEnabled('Horizontal Server List') ? '' : `
                        #app-mount .${AnimationsPlugin.modules.GuildsSidebar} [class*=listItem]:not([class*=listItemWrapper])
                        { transform: scaleX(0) rotate(90deg); }`}
                    `)

                        for (var i = 0; i < count; i++) {
                            let children = serversListElements[(this.settings.lists.sequence == "fromFirst" ? i : count - i - 1)];
                            if (!children) return;

                            if (removeAnimations) {
                                children.style.transform = 'none'
                            }
                            else {
                                children.style.animationDelay = `${(i * this.settings.lists.delay).toFixed(2)}s`;
                                children.style.animationFillMode = 'forwards';
                                children.style.animationName = this.settings.lists.custom.enabled &&
                                    (this.settings.lists.custom.page >= 0 ?
                                        this.settings.lists.custom.frames[this.settings.lists.custom.page]?.anim?.trim?.() != '' &&
                                        this.isValidKeyframe(this.settings.lists.custom.frames[this.settings.lists.custom.page]?.anim)
                                        : 0)
                                    ? 'custom-lists' : (this.settings.lists.name + (!BdApi.Themes.isEnabled('Horizontal Server List') ? '' : '_90'));
                            }
                        }

                        setTimeout(() => PluginUtilities.removeStyle(`${this.getName()}-serverslist`), (count * this.settings.lists.delay) + this.settings.lists.duration)

                    }

                    async resetAnimations(pause = 0) {
                        var createKeyFrame = function (/** @type {string} */ name, /** @type {string} */ originalName, rotate = 0, opacity = 1) {
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
                                "polygon":
                                    `@keyframes ${name} {
                                0% {
                                    clip-path:  polygon(40% 40%, 50% 25%, 60% 40%, 75% 50%, 60% 60%, 50% 75%, 40% 60%, 25% 50%);
                                    transform: rotate(${rotate}deg);
                                }
                                99% {
                                    clip-path: polygon(0 0, 50% 0, 100% 0, 100% 50%, 100% 100%, 50% 100%, 0 100%, 0 50%);
                                    transform: rotate(${rotate}deg);
                                }
                                100% {
                                    transform: rotate(${rotate}deg);
                                }
                            }`,
                                "circle":
                                    `@keyframes ${name} {
                                0% {
                                    clip-path: circle(25%);
                                    transform: rotate(${rotate}deg);
                                }
                                99% {
                                    clip-path: circle(100%);
                                    transform: rotate(${rotate}deg);
                                }
                                100% {
                                    transform: rotate(${rotate}deg);
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
                                    transform-origin: ${rotate != 90 ? '0% 50%' : '50%'};
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
                                    transform-origin: ${rotate != 90 ? '100% 50%' : '50%'};
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
                                    transform-origin: ${rotate != 90 ? '50% 100%' : '50%'};
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
                                    transform-origin: ${rotate != 90 ? '50% 0%' : '50%'};
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
                                    transform-origin: ${rotate != 90 ? '0% 100%' : '50%'};
                                    transform: scale(1) rotate(${rotate}deg) translate(0);
                                }
                            }`,
                                "slide-up-left":
                                    `@keyframes ${name} {
                                0% {
                                    transform-origin: 100% 100%;
                                    transform: scale(0) rotate(${rotate}deg);
                                }
                                100% {
                                    transform-origin: ${rotate != 90 ? '100% 100%' : '50%'};
                                    transform: scale(1) rotate(${rotate}deg) translate(0);
                                }
                            }`,
                                "slide-down-right":
                                    `@keyframes ${name} {
                                0% {
                                    transform-origin: 0% 0%;
                                    transform: scale(0) rotate(${rotate}deg);
                                }
                                100% {
                                    transform-origin: ${rotate != 90 ? '0% 0%' : '50%'};
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
                                    transform-origin: ${rotate != 90 ? '100% 0%' : '50%'};
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

                        let keyframes = () => {
                            var result = '';

                            AnimationsPlugin.names.forEach(
                                animName => {
                                    result += `
                                ${createKeyFrame(animName, animName, 0)}\n
                                ${createKeyFrame(`${animName}_offline`, animName, 0, 0.3)}\n
                                ${createKeyFrame(`${animName}_90`, animName, 90)}\n
                                `
                                }
                            )

                            return result
                        }

                        let animPrevStyles = () => {
                            let result = '';

                            ; (["lists", "buttons", "messages", "popouts"]).forEach(type => {
                                if (!AnimationsPlugin.names.includes(this.settings[type].name)) {
                                    this.settings[type].name = this.defaultSettings[type].name;
                                    PluginUtilities.saveSettings(this.getName(), this.settings);
                                }
                                if (this.settings[type].custom.frames.some((frame) => typeof frame == 'string')) {
                                    this.settings[type].custom.frames.forEach(
                                        (frame, index) => {
                                            if (typeof frame == 'string') this.settings[type].custom.frames[index] = {
                                                start: 'transform: scale(0);',
                                                anim: frame
                                            }
                                        }
                                    )
                                    PluginUtilities.saveSettings(this.getName(), this.settings);
                                }
                            });

                            ; (["lists", "buttons"]).forEach(type => {
                                if (!AnimationsPlugin.sequences.includes(this.settings[type].sequence)) {
                                    this.settings[type].sequence = this.defaultSettings[type].sequence;
                                    PluginUtilities.saveSettings(this.getName(), this.settings);
                                }
                            });

                            AnimationsPlugin.names.forEach(
                                animName => {
                                    ['lists', 'popouts', 'messages', 'buttons'].forEach(
                                        typeName => {
                                            for (var i = 1; i < 5; i++) {
                                                result += `.animPreview[pdata="${animName},${typeName}"]:hover > .animPreviewTempsContainer > .animTempBlock:nth-child(${i})`
                                                    + ` {
                                                transform: scale(0);
                                                animation-name: ${animName};
                                                animation-fill-mode: forwards;
                                                animation-duration: 0.3s;
                                                animation-delay: ${(i - 1) * 0.1}s;
                                            }\n`
                                            }
                                        }
                                    )
                                }
                            )

                            AnimationsPlugin.sequences.forEach(
                                seqName => {
                                    ['lists', 'popouts', 'messages', 'buttons'].forEach(
                                        typeName => {
                                            for (var i = 1; i < 5; i++) {
                                                result += `.animPreview[pdata="${seqName},${typeName}"]:hover > .animPreviewTempsContainer > .animTempBlock:${seqName == 'fromLast' ? 'nth-last-child' : 'nth-child'}(${i})`
                                                    + ` {
                                                transform: scale(0);
                                                animation-name: opacity;
                                                animation-fill-mode: forwards;
                                                animation-duration: 0;
                                                animation-delay: ${(i - 1) * 0.1}s;
                                            }\n`
                                            }
                                        }
                                    )
                                }
                            )

                            return result;
                        }

                        let nthStyles = () => {
                            let result = '';

                            for (var i = 1; i < 4 + 1 + 1; i++) {
                                result += `.animPreview[sequence="fromFirst"] .animTempBlock:nth-child(${i})
                            {animation-delay:${((i - 1) * 0.06).toFixed(2)}s}\n\n`
                            }
                            for (var i = 1; i < 4 + 1 + 1; i++) {
                                result += `.animPreview[sequence="fromLast"] .animTempBlock:nth-last-child(${i})
                            {animation-delay:${((i - 1) * 0.06).toFixed(2)}s}\n\n`
                            }

                            for (var i = 1; i < this.settings.messages.limit; i++) {
                                result += `.${AnimationsPlugin.modules.MessageListItem}:nth-last-child(${i}) > .${AnimationsPlugin.modules.Message}
                            {animation-delay:${((i - 1) * this.settings.messages.delay).toFixed(2)}s}\n`
                            }

                            return result;
                        }

                        let countStyles = () => {
                            let result = '';

                            ; ((this.isValidSelector(this.settings.lists.selectors) && this.settings.lists.selectors.trim() != '') ? this.settings.lists.selectors.split(",").map(item => item.trim()) : AnimationsPlugin.selectorsLists)
                                .forEach((selector, i) => {
                                    if (!this.settings.lists.enabled) return;

                                    let count = 65;

                                    if (this.settings.lists.sequence == 'fromFirst') for (var i = 1; i < count + 1; i++) {
                                        result += `${selector}:nth-child(${i}) `
                                            + `{animation-delay: ${((i - 1) * this.settings.lists.delay).toFixed(2)}s}\n\n`
                                    }
                                    if (this.settings.lists.sequence == 'fromLast') for (var i = 1; i < count + 1; i++) {
                                        result += `${selector}:nth-last-child(${i}) `
                                            + `{animation-delay: ${((i - 1) * this.settings.lists.delay).toFixed(2)}s}\n\n`
                                    }

                                })

                                ; ((this.isValidSelector(this.settings.buttons.selectors) && this.settings.buttons.selectors.trim() != '') ? this.settings.buttons.selectors.split(",").map(item => item.trim()) : AnimationsPlugin.selectorsButtons)
                                    .forEach(selector => {
                                        if (!this.settings.buttons.enabled) return;

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

                        this.styles = `

                ${!this.settings.lists.enabled ? '' : `
                ${this.settings.lists.selectors ? this.settings.lists.selectors : AnimationsPlugin.selectorsLists.join(', ')}
                {
                    ${this.settings.lists.custom.frames[this.settings.lists.custom.page]?.start ? this.settings.lists.custom.frames[this.settings.lists.custom.page]?.start : `transform: scale(0);`}
                    animation-name: ${this.settings.lists.custom.enabled &&
                                    (this.settings.lists.custom.page >= 0 ?
                                        this.settings.lists.custom.frames[this.settings.lists.custom.page]?.anim?.trim?.() != '' &&
                                        this.isValidKeyframe(this.settings.lists.custom.frames[this.settings.lists.custom.page]?.anim)
                                        : 0)
                                    ? 'custom-lists' : this.settings.lists.name};
                    animation-fill-mode: forwards;
                    animation-duration: ${this.settings.lists.duration}s;
                }
                `}

                ${!this.settings.buttons.enabled ? '' : `
                ${this.settings.buttons.selectors ? this.settings.buttons.selectors : AnimationsPlugin.selectorsButtons.join(', ')}
                {
                    ${this.settings.buttons.custom.frames[this.settings.buttons.custom.page]?.start ? this.settings.buttons.custom.frames[this.settings.buttons.custom.page]?.start : `transform: scale(0);`}
                    animation-name: ${this.settings.buttons.custom.enabled &&
                                    (this.settings.buttons.custom.page >= 0 ?
                                        this.settings.buttons.custom.frames[this.settings.buttons.custom.page].anim.trim() != '' &&
                                        this.isValidKeyframe(this.settings.buttons.custom.frames[this.settings.buttons.custom.page].anim)
                                        : 0)
                                    ? 'custom-buttons' : this.settings.buttons.name};
                    animation-fill-mode: forwards;
                    animation-duration: ${this.settings.buttons.duration}s;
                }
                `}

                ${!this.settings.popouts.enabled ? '' : `
                ${this.settings.popouts.selectors ? this.settings.popouts.selectors : AnimationsPlugin.selectorsPopouts.join(', ')}
                {
                    ${this.settings.popouts.custom.frames[this.settings.popouts.custom.page]?.start ? this.settings.popouts.custom.frames[this.settings.popouts.custom.page]?.start : `transform: scale(0);`}
                    animation-name: ${this.settings.popouts.custom.enabled &&
                                    (this.settings.popouts.custom.page >= 0 ?
                                        this.settings.popouts.custom.frames[this.settings.popouts.custom.page].anim.trim() != '' &&
                                        this.isValidKeyframe(this.settings.popouts.custom.frames[this.settings.popouts.custom.page].anim)
                                        : 0)
                                    ? 'custom-popouts' : this.settings.popouts.name};
                    animation-duration: ${this.settings.popouts.duration}s;
                }
                `}

                ${!this.settings.messages.enabled ? '' : `
                /* messages */
                .${AnimationsPlugin.modules.MessageListItem} > .${AnimationsPlugin.modules.Message}
                {
                    ${this.settings.messages.custom.frames[this.settings.messages.custom.page]?.start ? this.settings.messages.custom.frames[this.settings.messages.custom.page]?.start : `transform: scale(0);`}
                    animation-fill-mode: forwards;
                    animation-name: ${this.settings.messages.custom.enabled &&
                                    (this.settings.messages.custom.page >= 0 ?
                                        this.settings.messages.custom.frames[this.settings.messages.custom.page].anim.trim() != '' &&
                                        this.isValidKeyframe(this.settings.messages.custom.frames[this.settings.messages.custom.page].anim)
                                        : 0)
                                    ? 'custom-messages' : this.settings.messages.name};
                    animation-duration: ${this.settings.messages.duration}s;
                }

                /*lines-forward-messages fix*/
                .${AnimationsPlugin.modules.DividerReplying} {z-index: 0}
                `}

                /**Non-custom**/

                /*threads fork*/
                .${AnimationsPlugin.modules.ContainerSpine} > svg {
                    transform: scale(0);
                    transform-oringin: 100% 50%;
                    animation-timing-function: linear;
                    animation-duration: ${this.settings.lists.duration}s;
                    animation-fill-mode: forwards;
                }

                /*discord changelog video*/
                .${AnimationsPlugin.modules.VideoLead} {
                    animation-name: out !important;
                }

                /**Keyframes**/

                ${keyframes()}

                \n${animPrevStyles()}
                \n${nthStyles()}
                \n${countStyles()}

                /*Custom keyframes*/
                
                @keyframes custom-lists {
                    ${this.settings.lists.custom.page >= 0 ? this.settings.lists.custom.frames[this.settings.lists.custom.page]?.anim : ''}
                }

                @keyframes custom-buttons {
                    ${this.settings.buttons.custom.page >= 0 ? this.settings.buttons.custom.frames[this.settings.buttons.custom.page]?.anim : ''}
                }

                @keyframes custom-messages {
                    ${this.settings.messages.custom.page >= 0 ? this.settings.messages.custom.frames[this.settings.messages.custom.page]?.anim : ''}
                }

                @keyframes custom-popouts {
                    ${this.settings.popouts.custom.page >= 0 ? this.settings.popouts.custom.frames[this.settings.popouts.custom.page]?.anim : ''}
                }
                    `;

                        PluginUtilities.removeStyle(`${this.getName()}-main`);

                        await this.wait(pause)
                        PluginUtilities.addStyle(`${this.getName()}-main`, this.styles);
                        this.animateChannels();
                        this.animateMembers();
                        //this.animateServers();
                    }

                    closeSettings() {
                        document.querySelector('.bd-addon-modal-footer > .bd-button')?.click?.()
                    }

                    /**
                     * @param {number} ms
                     */
                    wait(ms) {
                        return new Promise((rs, rj) => setTimeout(rs, ms))
                    }

                    requestGet(url) {
                        const Http = new XMLHttpRequest();
                        Http.open("GET", url);
                        Http.send();

                        return Http;
                    }

                    fromBinary = (encoded) => {
                        return decodeURIComponent(atob(encoded).split('').map(function (c) {
                            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                        }).join(''));
                    }

                    /**
                     * @param {string} text
                     */
                    isValidKeyframeStruct(text) {
                        if (text?.trim() == '') return false;
                        return (/\s*((from|to|\d+%)\s*{\s*(\s*[a-z-]+:\s*[(\d*\.)*\w\(\)\,\s*]*[(\d*\.)*\w\(\)\,];?\s*)*}\s*)+\s*/g).test(text)
                    }

                    /**
                     * @param {string} text
                     */
                    isValidKeyframe(text) {
                        if (text?.trim() == '') return false;
                        var id = 'keyframe_validator_animations_plugin';
                        var css = `@keyframes KEYFRAME_VALIDATOR {\n${text}\n}`
                        BdApi.injectCSS(id, css)
                        var isValid = document.querySelector("head > bd-head > bd-styles > #" + id).sheet.rules[0]?.cssText.replace(/;| |\n/g, "") === css.replace(/;| |\n/g, "")
                        BdApi.clearCSS(id)
                        return isValid
                    }

                    /**
                     * @param {string} text
                     */
                    isValidCSSStruct(text) {
                        if (text?.trim() == '') return false;
                        return (/(\s*[a-z-]+:\s*[(\d*\.)*\w\(\)\,\s*]*[(\d*\.)*\w\(\)\,];?\s*)*/g).test(text)
                    }

                    /**
                     * @param {string} text
                     */
                    isValidCSS(text) {
                        if (text?.trim() == '') return false;
                        var id = 'css_validator_animations_plugin';
                        var css = `CSS_VALIDATOR {\n${text}\n}`
                        BdApi.injectCSS(id, css)
                        var isValid = document.querySelector(`head #${id}`).sheet.rules[0]?.cssText.replace(/;| |\n/g, "") === css.replace(/;| |\n/g, "")
                        BdApi.clearCSS(id)
                        return isValid
                    }

                    /**
                     * @param {string} text
                     */
                    isValidSelector(text) {
                        try {
                            document.querySelector(text)
                        } catch { return false }
                        return true
                    }

                    eqObjects(object1, object2) {
                        var isObject = function (object) {
                            return object != null && typeof object === 'object';
                        }
                        const keys1 = Object.keys(object1);
                        const keys2 = Object.keys(object2);
                        if (keys1.length !== keys2.length) {
                            return false;
                        }
                        for (const key of keys1) {
                            const val1 = object1[key];
                            const val2 = object2[key];
                            const areObjects = isObject(val1) && isObject(val2);
                            if (
                                areObjects && !deepEqual(val1, val2) ||
                                !areObjects && val1 !== val2
                            ) {
                                return false;
                            }
                        }
                        return true;
                    }

                    getSettingsPanel() {

                        /**
                         * @typedef { 'da' | 'de' | 'en-GB' | 'en-US' | 'es-ES' | 'fr' | 'hr' | 'it' | 'lt' | 'hu' | 'nl' | 'no' | 'pl' | 'pt-BR' | 'ro' | 'fi' | 'sv-SE' | 'vi' | 'tr' | 'cs' | 'el' | 'bg' | 'ru' | 'uk' | 'hi' | 'th' | 'zh-CN' | 'ja' | 'zh-TW' | 'ko' } locale
                         * @type {locale}
                         */
                        let locale = BdApi.findModuleByProps('locale', 'addChangeListener').locale;

                        let TEMPS = {
                            TOOLTIPS: {
                                BUTTON_ANIMATIONS_VERSION_CHANGELOG: 'Latest changes',
                                BUTTON_ANIMATIONS_VERSION_CHECK: 'Checks for updates',
                                BUTTON_ANIMATIONS_RESET: 'Resets all settings',
                                BUTTON_ANIMATIONS_REBUILD: 'Recreates styles. When the plugin is restarted, the styles are recreates too',
                                BUTTON_ANIMATIONS_ISSUES: 'Link to GitHub',
                                BUTTON_ANIMATIONS_SERVER: 'Link to Discord',
                                BUTTON_ANIMATIONS_DISCUSSIONS: 'Link to GitHub',
                                BUTTON_LISTS_SWITCH: 'Lists switch',
                                BUTTON_BUTTONS_SWITCH: 'Buttons switch',
                                BUTTON_MESSAGES_SWITCH: 'Messages switch',
                                BUTTON_POPOUTS_SWITCH: 'Popouts switch',
                                BUTTON_RESET_LISTS: 'Resets lists settings',
                                BUTTON_RESET_BUTTONS: 'Resets buttons settings',
                                BUTTON_RESET_MESSAGES: 'Resets messages settings',
                                BUTTON_RESET_POPOUTS: 'Resets popouts settings',
                                BUTTON_SELECTORS_LISTS_DEFAULT: 'Restores default selectors',
                                BUTTON_SELECTORS_LISTS_CLEAR: 'Clears the textarea',
                                BUTTON_SELECTORS_BUTTONS_DEFAULT: 'Restores default selectors',
                                BUTTON_SELECTORS_BUTTONS_CLEAR: 'Clears the textarea',
                                BUTTON_SELECTORS_POPOUTS_DEFAULT: 'Restores default selectors',
                                BUTTON_SELECTORS_POPOUTS_CLEAR: 'Clears the textarea'
                            },
                            LABELS: {
                                BUTTON_ANIMATIONS_RESET: 'Reset all',
                                BUTTON_ANIMATIONS_RESET_RESETING: 'Reseting...',
                                BUTTON_ANIMATIONS_REBUILD: 'Rebuild animations',
                                BUTTON_ANIMATIONS_VERSION_CHANGELOG: 'Changelog',
                                BUTTON_ANIMATIONS_VERSION_CHECK: 'Update',
                                BUTTON_ANIMATIONS_VERSION_CHECK_SEARCHING: 'Searching for updates...',
                                BUTTON_ANIMATIONS_VERSION_CHECK_TIMEOUT: 'Timeout exceeded',
                                BUTTON_ANIMATIONS_VERSION_CHECK_ERROR: 'An error occurred',
                                BUTTON_ANIMATIONS_VERSION_CHECK_OLDER: (_version = '{version}') => `v${_version} - Update`,
                                BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_OLDER_TITLE: 'Your version is older',
                                BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_OLDER_COMPARE: (_yourVersion, _ghVersion) => `v${_yourVersion} (your)  →  v${_ghVersion} (github)`,
                                BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_OLDER_NOTE: 'The plugin will be updated.',
                                BUTTON_ANIMATIONS_VERSION_CHECK_NEWER: (_version = '{version}') => `v${_version} - Your own version`,
                                BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_NEWER_TITLE: 'Your version is newer',
                                BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_NEWER_COMPARE: (_yourVersion, _ghVersion) => `v${_yourVersion} (your)  ←  v${_ghVersion} (github)`,
                                BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_NEWER_NOTE: 'The plugin will be downdated.',
                                BUTTON_ANIMATIONS_VERSION_CHECK_LATEST: (_version = '{version}') => `v${_version} - Latest version`,
                                BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_LATEST_TITLE: 'Your version is latest',
                                BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_LATEST_COMPARE: (_yourVersion, _ghVersion) => `v${_yourVersion} (your)  ↔  v${_ghVersion} (github)`,
                                BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_LATEST_NOTE: 'The plugin will be restored.',
                                BUTTON_ANIMATIONS_ISSUES: 'Issues',
                                BUTTON_ANIMATIONS_SERVER: 'Server',
                                BUTTON_ANIMATIONS_DISCUSSIONS: 'Discussions',
                                BUTTON_LISTS_SWITCH: 'Lists',
                                BUTTON_BUTTONS_SWITCH: 'Buttons',
                                BUTTON_MESSAGES_SWITCH: 'Messages',
                                BUTTON_POPOUTS_SWITCH: 'Popouts',
                                BUTTON_RESET_LISTS: 'Reset lists',
                                BUTTON_RESET_BUTTONS: 'Reset buttons',
                                BUTTON_RESET_MESSAGES: 'Reset messages',
                                BUTTON_RESET_POPOUTS: 'Reset popouts',
                                BUTTON_SELECTORS_LISTS_DEFAULT: 'Default',
                                BUTTON_SELECTORS_LISTS_CLEAR: 'Clear',
                                BUTTON_SELECTORS_BUTTONS_DEFAULT: 'Default',
                                BUTTON_SELECTORS_BUTTONS_CLEAR: 'Clear',
                                BUTTON_SELECTORS_POPOUTS_DEFAULT: 'Default',
                                BUTTON_SELECTORS_POPOUTS_CLEAR: 'Clear',

                                FIELD_NAME: 'Name',
                                FIELD_SEQUENCE: 'Sequence',
                                FIELD_DELAY: 'Delay',
                                FIELD_LIMIT: 'Limit',
                                FIELD_DURATION: 'Duration',

                                FIELD_LISTS_NAME_NOTE: (_default = '{default}') => `[${_default}] The name of the animation of the list items when they appear.`,
                                FIELD_LISTS_SEQUENCE_NOTE: (_default = '{default}') => `[${_default}] The sequence in which the list items are built.`,
                                FIELD_LISTS_DELAY_NOTE: (_default = '{default}') => `[${_default}] Delay before appearing for each list item in seconds.`,
                                FIELD_LISTS_LIMIT_NOTE: (_default = '{default}') => `[${_default}] The maximum number of items in the list for which the animation will be played.`,
                                FIELD_LISTS_DURATION_NOTE: (_default = '{default}') => `[${_default}] Animation playback speed in seconds for each list item after the delay.`,

                                FIELD_BUTTONS_NAME_NOTE: (_default = '{default}') => `[${_default}] The name of the animation of the buttons when they appear.`,
                                FIELD_BUTTONS_SEQUENCE_NOTE: (_default = '{default}') => `[${_default}] The sequence in which the buttons are built.`,
                                FIELD_BUTTONS_DELAY_NOTE: (_default = '{default}') => `[${_default}] Delay before appearing for each button in seconds.`,
                                FIELD_BUTTONS_DURATION_NOTE: (_default = '{default}') => `[${_default}] Animation playback speed in seconds for each button after the delay.`,

                                FIELD_MESSAGES_NAME_NOTE: (_default = '{default}') => `[${_default}] The name of the animation of the messages when they appear.`,
                                FIELD_MESSAGES_DELAY_NOTE: (_default = '{default}') => `[${_default}] Delay before appearing for each message in seconds.`,
                                FIELD_MESSAGES_LIMIT_NOTE: (_default = '{default}') => `[${_default}] The maximum number of messages in the list for which the animation will be played.`,
                                FIELD_MESSAGES_DURATION_NOTE: (_default = '{default}') => `[${_default}] Animation playback speed in seconds for each message after the delay.`,

                                FIELD_POPOUTS_NAME_NOTE: (_default = '{default}') => `[${_default}] The name of the animation of the popouts when they appear.`,
                                FIELD_POPOUTS_DURATION_NOTE: (_default = '{default}') => `[${_default}] Animation playback speed in seconds for a popout.`,

                                FIELD_LISTS_SELECTORS: 'Selectors of lists',
                                FIELD_LISTS_SELECTORS_NOTE: 'If you leave this field empty, the default selectors will appear here on reload. Changes to the selectors are saved when typing (if the code is valid). The separator is a comma (,).',
                                FIELD_BUTTONS_SELECTORS: 'Selectors of buttons',
                                FIELD_BUTTONS_SELECTORS_NOTE: 'If you leave this field empty, the default selectors will appear here on reload. Changes to the selectors are saved when typing (if the code is valid). The separator is a comma (,).',
                                FIELD_POPOUTS_SELECTORS: 'Selectors of popouts',
                                FIELD_POPOUTS_SELECTORS_NOTE: 'If you leave this field empty, the default selectors will appear here on reload. Changes to the selectors are saved when typing (if the code is valid). The separator is a comma (,).',

                                PREVIEW_SELECTING: 'Selecting',
                                PREVIEW_EDITING: 'Editing',
                                PREVIEW_BUTTON_TEMPLATE: 'Template',
                                PREVIEW_BUTTON_CLEAR: 'Clear',
                                PREVIEW_BUTTON_LOAD: 'Load',
                                PREVIEW_BUTTON_SAVE: 'Save',
                                PREVIEW_IN: 'In',
                                PREVIEW_OUT: 'Out',
                                PREVIEW_CIRCLE: 'Circle',
                                PREVIEW_POLYGON: 'Polygon',
                                PREVIEW_OPACITY: 'Opacity',
                                PREVIEW_SLIME: 'Slime',
                                PREVIEW_BRICK_RIGHT: 'Brick right',
                                PREVIEW_BRICK_LEFT: 'Brick left',
                                PREVIEW_BRICK_UP: 'Brick up',
                                PREVIEW_BRICK_DOWN: 'Brick down',
                                PREVIEW_SLIDE_RIGHT: 'Slide right',
                                PREVIEW_SLIDE_LEFT: 'Slide left',
                                PREVIEW_SLIDE_UP: 'Slide up',
                                PREVIEW_SLIDE_DOWN: 'Slide down',
                                PREVIEW_SLIDE_UP_RIGHT: 'Slide up (right)',
                                PREVIEW_SLIDE_UP_LEFT: 'Slide up (left)',
                                PREVIEW_SLIDE_DOWN_RIGHT: 'Slide down (right)',
                                PREVIEW_SLIDE_DOWN_LEFT: 'Slide down (left)',
                                PREVIEW_SKEW_RIGHT: 'Skew right',
                                PREVIEW_SKEW_LEFT: 'Skew left',
                                PREVIEW_WIDE_SKEW_RIGHT: 'Wide skew right',
                                PREVIEW_WIDE_SKEW_LEFT: 'Wide skew left',

                                PREVIEW_VERTICAL_FROM_FIRST: '↓',
                                PREVIEW_VERTICAL_FROM_LAST: '↑',
                                PREVIEW_HORIZONTAL_FROM_FIRST: '→',
                                PREVIEW_HORIZONTAL_FROM_LAST: '←',

                                GROUP_LISTS: 'Lists',
                                GROUP_BUTTONS: 'Buttons',
                                GROUP_MESSAGES: 'Messages',
                                GROUP_POPOUTS: 'Popouts',

                                GROUP_ADVANCED: 'Advanced',
                            }
                        }

                        // translations
                        switch (locale) {

                            // This is for translating the plugin

                            // case '*your locale (line 2651)*':
                            //     TEMPS = *...copy from the bottom and translate*
                            // break;

                            case 'tr':
                                TEMPS = {
                                    TOOLTIPS: {
                                        BUTTON_ANIMATIONS_VERSION_CHANGELOG: 'Son değişiklikler',
                                        BUTTON_ANIMATIONS_VERSION_CHECK: 'Güncellemeleri kontrol et',
                                        BUTTON_ANIMATIONS_RESET: 'Tüm ayarları sıfırla',
                                        BUTTON_ANIMATIONS_REBUILD: 'Stilleri yeniden oluşturur. Eklenti yeniden başlatıldığında, stiller de yeniden oluşturulur',
                                        BUTTON_ANIMATIONS_ISSUES: 'GitHub bağlantısı',
                                        BUTTON_ANIMATIONS_SERVER: 'Discord Bağlantısı',
                                        BUTTON_ANIMATIONS_DISCUSSIONS: 'GitHub bağlantısı',
                                        BUTTON_LISTS_SWITCH: 'Liste animasyonunu etkinleştir/devre dışı bırak',
                                        BUTTON_BUTTONS_SWITCH: 'Düğme animasyonunu etkinleştir/devre dışı bırak',
                                        BUTTON_MESSAGES_SWITCH: 'Mesaj animasyonunu etkinleştir/devre dışı bırak',
                                        BUTTON_POPOUTS_SWITCH: 'Popout animasyonu etkinleştir/devre dışı bırak',
                                        BUTTON_RESET_LISTS: 'Liste ayarlarını sıfırla',
                                        BUTTON_RESET_BUTTONS: 'Düğme ayarlarını sıfırla',
                                        BUTTON_RESET_MESSAGES: 'Mesaj ayarlarını sıfırla',
                                        BUTTON_RESET_POPOUTS: 'Popout ayarlarını sıfırla',
                                        BUTTON_SELECTORS_LISTS_DEFAULT: 'Varsayılan seçicileri geri yükle',
                                        BUTTON_SELECTORS_LISTS_CLEAR: 'Metin alanını temizle',
                                        BUTTON_SELECTORS_BUTTONS_DEFAULT: 'Varsayılan seçicileri geri yükle',
                                        BUTTON_SELECTORS_BUTTONS_CLEAR: 'Metin alanını temizle',
                                        BUTTON_SELECTORS_POPOUTS_DEFAULT: 'Varsayılan seçiciyi geri yükle',
                                        BUTTON_SELECTORS_POPOUTS_CLEAR: 'Metin alanını temizle'
                                    },
                                    LABELS: {
                                        BUTTON_ANIMATIONS_RESET: 'Hepsini sıfırla',
                                        BUTTON_ANIMATIONS_RESET_RESETING: 'Sıfırlanıyor...',
                                        BUTTON_ANIMATIONS_REBUILD: 'Animasyonları yeniden oluştur',
                                        BUTTON_ANIMATIONS_VERSION_CHANGELOG: 'Değişiklik günlüğü',
                                        BUTTON_ANIMATIONS_VERSION_CHECK: 'Güncelle',
                                        BUTTON_ANIMATIONS_VERSION_CHECK_SEARCHING: 'Güncellemeler aranıyor...',
                                        BUTTON_ANIMATIONS_VERSION_CHECK_TIMEOUT: 'Zaman aşımı aşıldı',
                                        BUTTON_ANIMATIONS_VERSION_CHECK_ERROR: 'Bir hata oluştu',
                                        BUTTON_ANIMATIONS_VERSION_CHECK_OLDER: (_version = '{version}') => `v${_version} - Güncelleme`,
                                        BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_OLDER_TITLE: 'Sürümünüz güncel değil',
                                        BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_OLDER_COMPARE: (yourV_, githubV_) => `v${yourV_} (senin)  →  v${githubV_} (github)`,
                                        BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_OLDER_NOTE: 'Eklenti güncellenecektir.',
                                        BUTTON_ANIMATIONS_VERSION_CHECK_NEWER: (_version = '{version}') => `v${_version} - Senin sürümün`,
                                        BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_NEWER_TITLE: 'Sürümünüz daha yeni',
                                        BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_NEWER_COMPARE: (yourV_, githubV_) => `v${yourV_} (senin)  ←  v${githubV_} (github)`,
                                        BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_NEWER_NOTE: 'Eklenti güncelliğini yitirecek.',
                                        BUTTON_ANIMATIONS_VERSION_CHECK_LATEST: (_version = '{version}') => `v${_version} - En son sürüm`,
                                        BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_LATEST_TITLE: 'Sürümünüz en son sürüm',
                                        BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_LATEST_COMPARE: (yourV_, githubV_) => `v${yourV_} (senin)  ↔  v${githubV_} (github)`,
                                        BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_LATEST_NOTE: 'Eklenti tamir edilecek.',
                                        BUTTON_ANIMATIONS_ISSUES: 'Konular',
                                        BUTTON_ANIMATIONS_SERVER: 'Sunucu',
                                        BUTTON_ANIMATIONS_DISCUSSIONS: 'Tartışmalar',
                                        BUTTON_LISTS_SWITCH: 'Listeler',
                                        BUTTON_BUTTONS_SWITCH: 'Düğmeler',
                                        BUTTON_MESSAGES_SWITCH: 'Mesajlar',
                                        BUTTON_POPOUTS_SWITCH: 'Popout\'lar',
                                        BUTTON_RESET_LISTS: 'Listeleri sıfırla',
                                        BUTTON_RESET_BUTTONS: 'Düğmeleri sıfırla',
                                        BUTTON_RESET_MESSAGES: 'Mesajları sıfırla',
                                        BUTTON_RESET_POPOUTS: 'Pop-out\'ları sıfırla',
                                        BUTTON_SELECTORS_LISTS_DEFAULT: 'Varsayılan',
                                        BUTTON_SELECTORS_LISTS_CLEAR: 'Temizle',
                                        BUTTON_SELECTORS_BUTTONS_DEFAULT: 'Varsayılan',
                                        BUTTON_SELECTORS_BUTTONS_CLEAR: 'Temizle',
                                        BUTTON_SELECTORS_POPOUTS_DEFAULT: 'Varsayılan',
                                        BUTTON_SELECTORS_POPOUTS_CLEAR: 'Temizle',

                                        FIELD_NAME: 'İsim',
                                        FIELD_SEQUENCE: 'Sekans',
                                        FIELD_DELAY: 'Gecikme',
                                        FIELD_LIMIT: 'Sınır',
                                        FIELD_DURATION: 'Süre',

                                        FIELD_LISTS_NAME_NOTE: (_default = '{default}') => `[${_default}] Liste öğelerinin göründükleri zaman animasyonunun adı.`,
                                        FIELD_LISTS_SEQUENCE_NOTE: (_default = '{default}') => `[${_default}] Liste öğelerinin oluşturulduğu sıra.`,
                                        FIELD_LISTS_DELAY_NOTE: (_default = '{default}') => `[${_default}] Her liste öğesi için saniye cinsinden görünmeden önce gecikme.`,
                                        FIELD_LISTS_LIMIT_NOTE: (_default = '{default}') => `[${_default}] Animasyonun oynatılacağı listedeki maksimum öğe sayısı.`,
                                        FIELD_LISTS_DURATION_NOTE: (_default = '{default}') => `[${_default}] Gecikmeden sonra her liste öğesi için saniye cinsinden animasyon oynatma hızı.`,

                                        FIELD_BUTTONS_NAME_NOTE: (_default = '{default}') => `[${_default}] Düğmelerin göründükleri zamanki animasyonunun adı.`,
                                        FIELD_BUTTONS_SEQUENCE_NOTE: (_default = '{default}') => `[${_default}] Düğmelerin oluşturulduğu sıra.`,
                                        FIELD_BUTTONS_DELAY_NOTE: (_default = '{default}') => `[${_default}] Her düğme için saniyeler içinde görünmeden önce gecikme.`,
                                        FIELD_BUTTONS_DURATION_NOTE: (_default = '{default}') => `[${_default}] Gecikmeden sonra her düğme için saniye cinsinden animasyon oynatma hızı.`,

                                        FIELD_MESSAGES_NAME_NOTE: (_default = '{default}') => `[${_default}] Mesajların göründüğünde animasyonun adı.`,
                                        FIELD_MESSAGES_DELAY_NOTE: (_default = '{default}') => `[${_default}] Her mesaj için saniyeler içinde görünmeden önce gecikme.`,
                                        FIELD_MESSAGES_LIMIT_NOTE: (_default = '{default}') => `[${_default}] Animasyonun oynatılacağı listedeki maksimum mesaj sayısı.`,
                                        FIELD_MESSAGES_DURATION_NOTE: (_default = '{default}') => `[${_default}] Gecikmeden sonra her mesaj için saniye cinsinden animasyon oynatma hızı.`,

                                        FIELD_POPOUTS_NAME_NOTE: (_default = '{default}') => `[${_default}] Göründükleri zaman pop-out'ların animasyonunun adı.`,
                                        FIELD_POPOUTS_DURATION_NOTE: (_default = '{default}') => `[${_default}] Bir açılır pencere için saniye cinsinden animasyon oynatma hızı.`,

                                        FIELD_LISTS_SELECTORS: 'Liste seçiciler',
                                        FIELD_LISTS_SELECTORS_NOTE: 'Bu alanı boş bırakırsanız, yeniden yükleme sırasında varsayılan seçiciler burada görünecektir. Seçicilerde yapılan değişiklikler yazarken kaydedilir (kod geçerliyse). Ayırıcı virgüldür (,).',
                                        FIELD_BUTTONS_SELECTORS: 'Düğme seçiciler',
                                        FIELD_BUTTONS_SELECTORS_NOTE: 'Bu alanı boş bırakırsanız, yeniden yükleme sırasında varsayılan seçiciler burada görünecektir. Seçicilerde yapılan değişiklikler yazarken kaydedilir (kod geçerliyse). Ayırıcı virgüldür (,).',
                                        FIELD_POPOUTS_SELECTORS: 'Popout seçicileri',
                                        FIELD_POPOUTS_SELECTORS_NOTE: 'Bu alanı boş bırakırsanız, yeniden yükleme sırasında varsayılan seçiciler burada görünecektir. Seçicilerde yapılan değişiklikler yazarken kaydedilir (kod geçerliyse). Ayırıcı virgüldür (,).',

                                        PREVIEW_SELECTING: 'Seçme',
                                        PREVIEW_EDITING: 'Düzenleme',
                                        PREVIEW_BUTTON_TEMPLATE: 'Şablon',
                                        PREVIEW_BUTTON_CLEAR: 'Temizle',
                                        PREVIEW_BUTTON_LOAD: 'Yükle',
                                        PREVIEW_BUTTON_SAVE: 'Kaydet',
                                        PREVIEW_IN: 'İçine',
                                        PREVIEW_OUT: 'Dışına',
                                        PREVIEW_CIRCLE: 'Daire',
                                        PREVIEW_POLYGON: 'Poligon',
                                        PREVIEW_OPACITY: 'Opaklık',
                                        PREVIEW_SLIME: 'Balçık',
                                        PREVIEW_BRICK_RIGHT: 'Sağa tuğla',
                                        PREVIEW_BRICK_LEFT: 'Sola tuğla',
                                        PREVIEW_BRICK_UP: 'Yukarı tuğla',
                                        PREVIEW_BRICK_DOWN: 'Aşağı tuğla',
                                        PREVIEW_SLIDE_RIGHT: 'Sağa kaydır',
                                        PREVIEW_SLIDE_LEFT: 'Sola kaydır',
                                        PREVIEW_SLIDE_UP: 'Yukarı kaydır',
                                        PREVIEW_SLIDE_DOWN: 'Aşağı kaydır',
                                        PREVIEW_SLIDE_UP_RIGHT: 'Yukarı kaydır (sağ)',
                                        PREVIEW_SLIDE_UP_LEFT: 'Yukarı kaydır (sol)',
                                        PREVIEW_SLIDE_DOWN_RIGHT: 'Aşağı kaydır (sağ)',
                                        PREVIEW_SLIDE_DOWN_LEFT: 'Aşağı kaydır (sağ)',
                                        PREVIEW_SKEW_RIGHT: 'Sağa eğ',
                                        PREVIEW_SKEW_LEFT: 'Sola eğ',
                                        PREVIEW_WIDE_SKEW_RIGHT: 'Sağa geniş eğim',
                                        PREVIEW_WIDE_SKEW_LEFT: 'Sola geniş eğim',

                                        PREVIEW_VERTICAL_FROM_FIRST: '↓',
                                        PREVIEW_VERTICAL_FROM_LAST: '↑',
                                        PREVIEW_HORIZONTAL_FROM_FIRST: '→',
                                        PREVIEW_HORIZONTAL_FROM_LAST: '←',

                                        GROUP_LISTS: 'Listeler',
                                        GROUP_BUTTONS: 'Düğmeler',
                                        GROUP_MESSAGES: 'Mesajlar',
                                        GROUP_POPOUTS: 'Popout\'lar',

                                        GROUP_ADVANCED: 'Gelişmiş',
                                    }
                                }
                                break;

                            case 'fr':
                                TEMPS = {
                                    TOOLTIPS: {
                                        BUTTON_ANIMATIONS_VERSION_CHANGELOG: 'Dernier changement',
                                        BUTTON_ANIMATIONS_VERSION_CHECK: 'Rechercher des mises à jour',
                                        BUTTON_ANIMATIONS_RESET: 'Réinitialise tous les paramètres',
                                        BUTTON_ANIMATIONS_REBUILD: 'Récrer les styles. Quand le plugin sera redémarré, les styles seront recrées',
                                        BUTTON_ANIMATIONS_ISSUES: 'Lien vers GitHub',
                                        BUTTON_ANIMATIONS_SERVER: 'Link to Discord',
                                        BUTTON_ANIMATIONS_DISCUSSIONS: 'Lien vers GitHub',
                                        BUTTON_LISTS_SWITCH: 'Activer/désactiver l\'animation des listes',
                                        BUTTON_BUTTONS_SWITCH: 'Activer/désactiver l\'animation des boutons',
                                        BUTTON_MESSAGES_SWITCH: 'Activer/désactiver l\'animation des messages',
                                        BUTTON_POPOUTS_SWITCH: 'Activer/désactiver l\'animation des pop-out',
                                        BUTTON_RESET_LISTS: 'Réinitialise les paramètres de listes',
                                        BUTTON_RESET_BUTTONS: 'Réinitialise les paramètres de boutons',
                                        BUTTON_RESET_MESSAGES: 'Réinitialise les paramètres de messages',
                                        BUTTON_RESET_POPOUTS: 'Réinitialise les paramètres de pop-out',
                                        BUTTON_SELECTORS_LISTS_DEFAULT: 'Restore les selecteurs par défauts',
                                        BUTTON_SELECTORS_LISTS_CLEAR: 'Vider le champs de texte',
                                        BUTTON_SELECTORS_BUTTONS_DEFAULT: 'Restore les selecteurs par défauts',
                                        BUTTON_SELECTORS_BUTTONS_CLEAR: 'Vider le champs de texte',
                                        BUTTON_SELECTORS_POPOUTS_DEFAULT: 'Restore les selecteurs par défauts',
                                        BUTTON_SELECTORS_POPOUTS_CLEAR: 'Vider le champs de texte'
                                    },
                                    LABELS: {
                                        BUTTON_ANIMATIONS_RESET: 'Tout réinitialiser',
                                        BUTTON_ANIMATIONS_RESET_RESETING: 'Réinitialisation...',
                                        BUTTON_ANIMATIONS_REBUILD: 'Récréation des animations',
                                        BUTTON_ANIMATIONS_VERSION_CHANGELOG: 'Changelog',
                                        BUTTON_ANIMATIONS_VERSION_CHECK: 'Mise à jour',
                                        BUTTON_ANIMATIONS_VERSION_CHECK_SEARCHING: 'Recherche de mise à jour...',
                                        BUTTON_ANIMATIONS_VERSION_CHECK_TIMEOUT: 'Temps de recherche excéder',
                                        BUTTON_ANIMATIONS_VERSION_CHECK_ERROR: 'Une erreur est apparue',
                                        BUTTON_ANIMATIONS_VERSION_CHECK_OLDER: (_version = '{version}') => `v${_version} - Mise à jour`,
                                        BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_OLDER_TITLE: 'Votre version est obsolète',
                                        BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_OLDER_COMPARE: (_yourVersion, _ghVersion) => `v${_yourVersion} (toi)  →  v${_ghV} (github)`,
                                        BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_OLDER_NOTE: 'Le plugin va être mis à jour.',
                                        BUTTON_ANIMATIONS_VERSION_CHECK_NEWER: (_version = '{version}') => `v${_version} - Votre version`,
                                        BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_NEWER_TITLE: 'Votre version est la plus récente',
                                        BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_NEWER_COMPARE: (_yourVersion, _ghVersion) => `v${_yourVersion} (toi)  ←  v${_ghVersion} (github)`,
                                        BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_NEWER_NOTE: 'Votre version est la plus récente.',
                                        BUTTON_ANIMATIONS_VERSION_CHECK_LATEST: (_version = '{version}') => `v${_version} - Dernière version`,
                                        BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_LATEST_TITLE: 'Votre version est la plus récente',
                                        BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_LATEST_COMPARE: (_yourVersion, _ghVersion) => `v${_yourVersion} (toi)  ↔  v${_ghVersion} (github)`,
                                        BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_LATEST_NOTE: 'Le plugin va être restoré.',
                                        BUTTON_ANIMATIONS_ISSUES: 'Problème',
                                        BUTTON_ANIMATIONS_SERVER: 'Server',
                                        BUTTON_ANIMATIONS_DISCUSSIONS: 'Discussions',
                                        BUTTON_LISTS_SWITCH: 'Listes',
                                        BUTTON_BUTTONS_SWITCH: 'Boutons',
                                        BUTTON_MESSAGES_SWITCH: 'Messages',
                                        BUTTON_POPOUTS_SWITCH: 'Popouts',
                                        BUTTON_RESET_LISTS: 'Réinitialiser listes',
                                        BUTTON_RESET_BUTTONS: 'Réinitialiser boutons',
                                        BUTTON_RESET_MESSAGES: 'Réinitialiser messages',
                                        BUTTON_RESET_POPOUTS: 'Réinitialiser popouts',
                                        BUTTON_SELECTORS_LISTS_DEFAULT: 'Par défaut',
                                        BUTTON_SELECTORS_LISTS_CLEAR: 'Vider',
                                        BUTTON_SELECTORS_BUTTONS_DEFAULT: 'Par défaut',
                                        BUTTON_SELECTORS_BUTTONS_CLEAR: 'Vider',
                                        BUTTON_SELECTORS_POPOUTS_DEFAULT: 'Par défaut',
                                        BUTTON_SELECTORS_POPOUTS_CLEAR: 'Vider',

                                        FIELD_NAME: 'Nom',
                                        FIELD_SEQUENCE: 'Séquence',
                                        FIELD_DELAY: 'Delai',
                                        FIELD_LIMIT: 'Limite',
                                        FIELD_DURATION: 'Durée',

                                        FIELD_LISTS_NAME_NOTE: (_default = '{default}') => `[${_default}] L'animation à utiliser pour l'animation des éléments d'une liste.`,
                                        FIELD_LISTS_SEQUENCE_NOTE: (_default = '{default}') => `[${_default}] La séquence de comment se créer les éléments d'une liste.`,
                                        FIELD_LISTS_DELAY_NOTE: (_default = '{default}') => `[${_default}] Le délai avant l'apparition de chaque éléments d'une liste en seconde.`,
                                        FIELD_LISTS_LIMIT_NOTE: (_default = '{default}') => `[${_default}] Le nombre maximum d'élément d'une liste qui seront animé.`,
                                        FIELD_LISTS_DURATION_NOTE: (_default = '{default}') => `[${_default}] La durée de l'animation de chaque éléments d'une liste.`,

                                        FIELD_BUTTONS_NAME_NOTE: (_default = '{default}') => `[${_default}] L'animation à utiliser pour l'animation des boutons.`,
                                        FIELD_BUTTONS_SEQUENCE_NOTE: (_default = '{default}') => `[${_default}] La séquence de comment se créer les boutons.`,
                                        FIELD_BUTTONS_DELAY_NOTE: (_default = '{default}') => `[${_default}] Le délai avant l'apparition de chaque boutons en seconde.`,
                                        FIELD_BUTTONS_DURATION_NOTE: (_default = '{default}') => `[${_default}] La durée de l'animation de chaque boutons.`,

                                        FIELD_MESSAGES_NAME_NOTE: (_default = '{default}') => `[${_default}] L'animation à utiliser pour l'animation des messages.`,
                                        FIELD_MESSAGES_DELAY_NOTE: (_default = '{default}') => `[${_default}] La séquence de comment se créer les messages.`,
                                        FIELD_MESSAGES_LIMIT_NOTE: (_default = '{default}') => `[${_default}] Le délai avant l'apparition de chaque messages en seconde.`,
                                        FIELD_MESSAGES_DURATION_NOTE: (_default = '{default}') => `[${_default}] La durée de l'animation de chaque messages.`,

                                        FIELD_POPOUTS_NAME_NOTE: (_default = '{default}') => `[${_default}] L'animation à utiliser pour l'animation des popout.`,
                                        FIELD_POPOUTS_DURATION_NOTE: (_default = '{default}') => `[${_default}] La durée de l'animation de chaque popout.`,

                                        FIELD_LISTS_SELECTORS: 'Selecteurs de listes',
                                        FIELD_LISTS_SELECTORS_NOTE: 'Si vous laissez le champ vide, les selecteurs par défaut réapparaitrons au redémarrage. Les changement de selecteurs sont sauvegardé dès l\'écriture (si le code est valide). Le séparateur est une virgule (,).',
                                        FIELD_BUTTONS_SELECTORS: 'Selecteurs de boutons',
                                        FIELD_BUTTONS_SELECTORS_NOTE: 'Si vous laissez le champ vide, les selecteurs par défaut réapparaitrons au redémarrage. Les changement de selecteurs sont sauvegardé dès l\'écriture (si le code est valide). Le séparateur est une virgule (,).',
                                        FIELD_POPOUTS_SELECTORS: 'Selecteurs de popout',
                                        FIELD_POPOUTS_SELECTORS_NOTE: 'Si vous laissez le champ vide, les selecteurs par défaut réapparaitrons au redémarrage. Les changement de selecteurs sont sauvegardé dès l\'écriture (si le code est valide). Le séparateur est une virgule (,).',

                                        PREVIEW_SELECTING: 'Selection',
                                        PREVIEW_EDITING: 'Edition',
                                        PREVIEW_BUTTON_TEMPLATE: 'Modèle',
                                        PREVIEW_BUTTON_CLEAR: 'Vider',
                                        PREVIEW_BUTTON_LOAD: 'Charger',
                                        PREVIEW_BUTTON_SAVE: 'Sauvegarder',
                                        PREVIEW_IN: 'Dessus',
                                        PREVIEW_OUT: 'Dessous',
                                        PREVIEW_CIRCLE: 'Cercle',
                                        PREVIEW_POLYGON: 'Polygone',
                                        PREVIEW_OPACITY: 'Opacité',
                                        PREVIEW_SLIME: 'Slime',
                                        PREVIEW_BRICK_RIGHT: 'Brique droite',
                                        PREVIEW_BRICK_LEFT: 'Brique gauche',
                                        PREVIEW_BRICK_UP: 'Brick du dessus',
                                        PREVIEW_BRICK_DOWN: 'Brick du dessous',
                                        PREVIEW_SLIDE_RIGHT: 'Glissade droite',
                                        PREVIEW_SLIDE_LEFT: 'Glissade gauche',
                                        PREVIEW_SLIDE_UP: 'Glissade du dessus',
                                        PREVIEW_SLIDE_DOWN: 'Glissade du dessous',
                                        PREVIEW_SLIDE_UP_RIGHT: 'Glissade dessus (droite)',
                                        PREVIEW_SLIDE_UP_LEFT: 'Glissade dessus (gauche)',
                                        PREVIEW_SLIDE_DOWN_RIGHT: 'Glissade dessous (droite)',
                                        PREVIEW_SLIDE_DOWN_LEFT: 'Glissade dessous (gauche)',
                                        PREVIEW_SKEW_RIGHT: 'Inclinaison droite',
                                        PREVIEW_SKEW_LEFT: 'Inclinaison gauche',
                                        PREVIEW_WIDE_SKEW_RIGHT: 'Grande Inclinaison droite',
                                        PREVIEW_WIDE_SKEW_LEFT: 'Grande Inclinaison gauche',

                                        PREVIEW_VERTICAL_FROM_FIRST: '↓',
                                        PREVIEW_VERTICAL_FROM_LAST: '↑',
                                        PREVIEW_HORIZONTAL_FROM_FIRST: '→',
                                        PREVIEW_HORIZONTAL_FROM_LAST: '←',

                                        GROUP_LISTS: 'Listes',
                                        GROUP_BUTTONS: 'Boutons',
                                        GROUP_MESSAGES: 'Messages',
                                        GROUP_POPOUTS: 'Popout',

                                        GROUP_ADVANCED: 'Avancés',
                                    }
                                }
                                break;

                            case 'uk':
                                TEMPS = {
                                    TOOLTIPS: {
                                        BUTTON_ANIMATIONS_VERSION_CHANGELOG: 'Останні зміни',
                                        BUTTON_ANIMATIONS_VERSION_CHECK: 'Перевіряє оновлення',
                                        BUTTON_ANIMATIONS_RESET: 'Скидає всі налаштування',
                                        BUTTON_ANIMATIONS_REBUILD: 'Перестворює стилі. При перезавантаженні плагіну стилі також перестворюються',
                                        BUTTON_ANIMATIONS_ISSUES: 'Посилання на GitHub',
                                        BUTTON_ANIMATIONS_SERVER: 'Посилання на Discord',
                                        BUTTON_ANIMATIONS_DISCUSSIONS: 'Посилання на GitHub',
                                        BUTTON_LISTS_SWITCH: 'Перемикання списків',
                                        BUTTON_BUTTONS_SWITCH: 'Перемикання кнопок',
                                        BUTTON_MESSAGES_SWITCH: 'Перемикання повідомлень',
                                        BUTTON_POPOUTS_SWITCH: 'Перемикання вспливаючих вікон',
                                        BUTTON_RESET_LISTS: 'Скидає налаштування списків',
                                        BUTTON_RESET_BUTTONS: 'Скидає налаштування кнопок',
                                        BUTTON_RESET_MESSAGES: 'Скидає налаштування повідомлень',
                                        BUTTON_RESET_POPOUTS: 'Скидає налаштування вспливаючих вікон',
                                        BUTTON_SELECTORS_LISTS_DEFAULT: 'Відновлює заводські селектори',
                                        BUTTON_SELECTORS_LISTS_CLEAR: 'Очищає тектове поле',
                                        BUTTON_SELECTORS_BUTTONS_DEFAULT: 'Відновлює заводські селектори',
                                        BUTTON_SELECTORS_BUTTONS_CLEAR: 'Очищає тектове поле',
                                        BUTTON_SELECTORS_POPOUTS_DEFAULT: 'Відновлює заводські селектори',
                                        BUTTON_SELECTORS_POPOUTS_CLEAR: 'Очищає тектове поле'
                                    },
                                    LABELS: {
                                        BUTTON_ANIMATIONS_RESET: 'Скинути все',
                                        BUTTON_ANIMATIONS_RESET_RESETING: 'Скидання...',
                                        BUTTON_ANIMATIONS_REBUILD: 'Перестворити анімації',
                                        BUTTON_ANIMATIONS_VERSION_CHANGELOG: 'Список змін',
                                        BUTTON_ANIMATIONS_VERSION_CHECK: 'Оновити',
                                        BUTTON_ANIMATIONS_VERSION_CHECK_SEARCHING: 'Пошук оновлень...',
                                        BUTTON_ANIMATIONS_VERSION_CHECK_TIMEOUT: 'Перевищено час очікування',
                                        BUTTON_ANIMATIONS_VERSION_CHECK_ERROR: 'Сталася помилка',
                                        BUTTON_ANIMATIONS_VERSION_CHECK_OLDER: (_version = '{version}') => `v${_version} - Оновити`,
                                        BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_OLDER_TITLE: 'Ваша версія застаріла',
                                        BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_OLDER_COMPARE: (_yourVersion, _ghVersion) => `v${_yourVersion} (ваша)  →  v${_ghVersion} (github)`,
                                        BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_OLDER_NOTE: 'Плагін буде оновлено',
                                        BUTTON_ANIMATIONS_VERSION_CHECK_NEWER: (_version = '{version}') => `v${_version} - Ваша версія`,
                                        BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_NEWER_TITLE: 'Ваша версія новіша',
                                        BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_NEWER_COMPARE: (_yourVersion, _ghVersion) => `v${_yourVersion} (ваша)  ←  v${_ghVersion} (github)`,
                                        BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_NEWER_NOTE: 'Плагін буде деоновлений.',
                                        BUTTON_ANIMATIONS_VERSION_CHECK_LATEST: (_version = '{version}') => `v${_version} - Остання версія`,
                                        BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_LATEST_TITLE: 'Ваша версія остання',
                                        BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_LATEST_COMPARE: (_yourVersion, _ghVersion) => `v${_yourVersion} (ваша)  ↔  v${_ghVersion} (github)`,
                                        BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_LATEST_NOTE: 'Плагін буде перевстановлено.',
                                        BUTTON_ANIMATIONS_ISSUES: 'Проблеми',
                                        BUTTON_ANIMATIONS_SERVER: 'Сервер',
                                        BUTTON_ANIMATIONS_DISCUSSIONS: 'Обговорення',
                                        BUTTON_LISTS_SWITCH: 'Списки',
                                        BUTTON_BUTTONS_SWITCH: 'Кнопки',
                                        BUTTON_MESSAGES_SWITCH: 'Повідомлення',
                                        BUTTON_POPOUTS_SWITCH: 'Вспл. вікна',
                                        BUTTON_RESET_LISTS: 'Скинути списки',
                                        BUTTON_RESET_BUTTONS: 'Скинути кнопки',
                                        BUTTON_RESET_MESSAGES: 'Скинути повідомлення',
                                        BUTTON_RESET_POPOUTS: 'Скинути вспл. вікна',
                                        BUTTON_SELECTORS_LISTS_DEFAULT: 'За замовчуванням',
                                        BUTTON_SELECTORS_LISTS_CLEAR: 'Очистити',
                                        BUTTON_SELECTORS_BUTTONS_DEFAULT: 'За замовчуванням',
                                        BUTTON_SELECTORS_BUTTONS_CLEAR: 'Очистити',
                                        BUTTON_SELECTORS_POPOUTS_DEFAULT: 'За замовчуванням',
                                        BUTTON_SELECTORS_POPOUTS_CLEAR: 'Очистити',

                                        FIELD_NAME: 'Назва',
                                        FIELD_SEQUENCE: 'Напрямок',
                                        FIELD_DELAY: 'Затримка',
                                        FIELD_LIMIT: 'Ліміт',
                                        FIELD_DURATION: 'Тривалість',

                                        FIELD_LISTS_NAME_NOTE: (_default = '{default}') => `[${_default}] Назва анимації елементів списку при їх появі.`,
                                        FIELD_LISTS_SEQUENCE_NOTE: (_default = '{default}') => `[${_default}] Напрямок в якому вибудовуватимуться елементи списку.`,
                                        FIELD_LISTS_DELAY_NOTE: (_default = '{default}') => `[${_default}] Затримка перед появою кожного елемента списку в секундах.`,
                                        FIELD_LISTS_LIMIT_NOTE: (_default = '{default}') => `[${_default}] Максимальна кількість елементів у списку, для яких відтворюватиметься анімація.`,
                                        FIELD_LISTS_DURATION_NOTE: (_default = '{default}') => `[${_default}] Швидкість відтворення анімації в секундах для кожного списку після затримки.`,

                                        FIELD_BUTTONS_NAME_NOTE: (_default = '{default}') => `[${_default}] Назва анімації кнопок при їх появі.`,
                                        FIELD_BUTTONS_SEQUENCE_NOTE: (_default = '{default}') => `[${_default}] Послідовність, у якій вибудовуються кнопки.`,
                                        FIELD_BUTTONS_DELAY_NOTE: (_default = '{default}') => `[${_default}] Затримка перед появою кожної кнопки в секундах.`,
                                        FIELD_BUTTONS_DURATION_NOTE: (_default = '{default}') => `[${_default}] Швидкість відтворення анімації в секундах для кожної кнопки після затримки.`,

                                        FIELD_MESSAGES_NAME_NOTE: (_default = '{default}') => `[${_default}] Назва анімації повідомлень при їх появі.`,
                                        FIELD_MESSAGES_DELAY_NOTE: (_default = '{default}') => `[${_default}] Затримка перед появою кожного повідомлення в секундах.`,
                                        FIELD_MESSAGES_LIMIT_NOTE: (_default = '{default}') => `[${_default}] Максимальна кількість повідомлень у списку, для яких відтворюватиметься анімація.`,
                                        FIELD_MESSAGES_DURATION_NOTE: (_default = '{default}') => `[${_default}] Швидкість відтворення анімації в секундах для кожного повідомлення після затримки.`,

                                        FIELD_POPOUTS_NAME_NOTE: (_default = '{default}') => `[${_default}] Назва анімації вспливаючих вікон при їх появі.`,
                                        FIELD_POPOUTS_DURATION_NOTE: (_default = '{default}') => `[${_default}] Швидкість відтворення анімації в секундах для вспливаючих вікон.`,

                                        FIELD_LISTS_SELECTORS: 'Селектори списків',
                                        FIELD_LISTS_SELECTORS_NOTE: 'Якщо залишити це поле порожнім, при перезавантаженні тут відображатимуться селектори за замовчуванням. Зміни селекторів зберігаються під час введення (якщо код коректний). Розділювачем є кома (,).',
                                        FIELD_BUTTONS_SELECTORS: 'Селектори кнопок',
                                        FIELD_BUTTONS_SELECTORS_NOTE: 'Якщо залишити це поле порожнім, при перезавантаженні тут відображатимуться селектори за замовчуванням. Зміни селекторів зберігаються під час введення (якщо код коректний). Розділювачем є кома (,).',
                                        FIELD_POPOUTS_SELECTORS: 'Селектори вспливаючих вікон',
                                        FIELD_POPOUTS_SELECTORS_NOTE: 'Якщо залишити це поле порожнім, при перезавантаженні тут відображатимуться селектори за замовчуванням. Зміни селекторів зберігаються під час введення (якщо код коректний). Розділювачем є кома (,).',
                                        PREVIEW_SELECTING: 'Обирати',
                                        PREVIEW_EDITING: 'Редагувати',
                                        PREVIEW_BUTTON_TEMPLATE: 'Шаблон',
                                        PREVIEW_BUTTON_CLEAR: 'Очистити',
                                        PREVIEW_BUTTON_LOAD: 'Завантажити',
                                        PREVIEW_BUTTON_SAVE: 'Зберегти',
                                        PREVIEW_IN: 'Вхід',
                                        PREVIEW_OUT: 'Вихід',
                                        PREVIEW_CIRCLE: 'Коло',
                                        PREVIEW_POLYGON: 'Полігон',
                                        PREVIEW_OPACITY: 'Прозорість',
                                        PREVIEW_SLIME: 'Слиз',
                                        PREVIEW_BRICK_RIGHT: 'Цеглина праворуч',
                                        PREVIEW_BRICK_LEFT: 'Цеглина ліворуч',
                                        PREVIEW_BRICK_UP: 'Цеглина вгору',
                                        PREVIEW_BRICK_DOWN: 'Цеглина вниз',
                                        PREVIEW_SLIDE_RIGHT: 'Ковзання праворуч',
                                        PREVIEW_SLIDE_LEFT: 'Ковзання ліворуч',
                                        PREVIEW_SLIDE_UP: 'Ковзання вгору',
                                        PREVIEW_SLIDE_DOWN: 'Ковзання вниз',
                                        PREVIEW_SLIDE_UP_RIGHT: 'Ковзання вгору (праворуч)',
                                        PREVIEW_SLIDE_UP_LEFT: 'Ковзання вгору (ліворуч)',
                                        PREVIEW_SLIDE_DOWN_RIGHT: 'Ковзання вниз (праворуч)',
                                        PREVIEW_SLIDE_DOWN_LEFT: 'Ковзання вниз (ліворуч)',
                                        PREVIEW_SKEW_RIGHT: 'Перекіс праворуч',
                                        PREVIEW_SKEW_LEFT: 'Перекіс ліворуч',
                                        PREVIEW_WIDE_SKEW_RIGHT: 'Широкий перекіс праворуч',
                                        PREVIEW_WIDE_SKEW_LEFT: 'Широкий перекіс ліворуч',

                                        PREVIEW_VERTICAL_FROM_FIRST: '↓',
                                        PREVIEW_VERTICAL_FROM_LAST: '↑',
                                        PREVIEW_HORIZONTAL_FROM_FIRST: '→',
                                        PREVIEW_HORIZONTAL_FROM_LAST: '←',

                                        GROUP_LISTS: 'Списки',
                                        GROUP_BUTTONS: 'Кнопки',
                                        GROUP_MESSAGES: 'Повідомлення',
                                        GROUP_POPOUTS: 'Вспл. вікна',

                                        GROUP_ADVANCED: 'Розширені',
                                    }
                                }
                                break;

                            case 'ru':
                                TEMPS = {
                                    TOOLTIPS: {
                                        BUTTON_ANIMATIONS_VERSION_CHANGELOG: 'Последние изменения',
                                        BUTTON_ANIMATIONS_VERSION_CHECK: 'Проверяет обновления',
                                        BUTTON_ANIMATIONS_RESET: 'Сбрасывает все настройки',
                                        BUTTON_ANIMATIONS_REBUILD: 'Пересоздаёт стили. При перезагрузке плагина стили тоже пересоздаются',
                                        BUTTON_ANIMATIONS_ISSUES: 'Ссылка на GitHub',
                                        BUTTON_ANIMATIONS_SERVER: 'Ссылка на Discord',
                                        BUTTON_ANIMATIONS_DISCUSSIONS: 'Ссылка на GitHub',
                                        BUTTON_LISTS_SWITCH: 'Переключение списков',
                                        BUTTON_BUTTONS_SWITCH: 'Переключение кнопок',
                                        BUTTON_MESSAGES_SWITCH: 'Переключение сообщений',
                                        BUTTON_POPOUTS_SWITCH: 'Переключение всплывающих окон',
                                        BUTTON_RESET_LISTS: 'Сбрасывает настройки списков',
                                        BUTTON_RESET_BUTTONS: 'Сбрасывает настройки кнопок',
                                        BUTTON_RESET_MESSAGES: 'Сбрасывает настройки сообщений',
                                        BUTTON_RESET_POPOUTS: 'Сбрасывает настройки всплывающих окон',
                                        BUTTON_SELECTORS_LISTS_DEFAULT: 'Восстанавливает заводские селекторы',
                                        BUTTON_SELECTORS_LISTS_CLEAR: 'Очищает тектовое поле',
                                        BUTTON_SELECTORS_BUTTONS_DEFAULT: 'Восстанавливает заводские селекторы',
                                        BUTTON_SELECTORS_BUTTONS_CLEAR: 'Очищает тектовое поле',
                                        BUTTON_SELECTORS_POPOUTS_DEFAULT: 'Восстанавливает заводские селекторы',
                                        BUTTON_SELECTORS_POPOUTS_CLEAR: 'Очищает тектовое поле'
                                    },
                                    LABELS: {
                                        BUTTON_ANIMATIONS_RESET: 'Сбросить всё',
                                        BUTTON_ANIMATIONS_RESET_RESETING: 'Сбрасывание...',
                                        BUTTON_ANIMATIONS_REBUILD: 'Пересоздать анимации',
                                        BUTTON_ANIMATIONS_VERSION_CHANGELOG: 'Список изменений',
                                        BUTTON_ANIMATIONS_VERSION_CHECK: 'Обновить',
                                        BUTTON_ANIMATIONS_VERSION_CHECK_SEARCHING: 'Поиск обновлений...',
                                        BUTTON_ANIMATIONS_VERSION_CHECK_TIMEOUT: 'Превышено вр. ожидания',
                                        BUTTON_ANIMATIONS_VERSION_CHECK_ERROR: 'Случилась ошибка',
                                        BUTTON_ANIMATIONS_VERSION_CHECK_OLDER: (_version = '{version}') => `v${_version} - Обновить`,
                                        BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_OLDER_TITLE: 'Ваша версия устарела',
                                        BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_OLDER_COMPARE: (_yourVersion, _ghVersion) => `v${_yourVersion} (ваша)  →  v${_ghVersion} (github)`,
                                        BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_OLDER_NOTE: 'Плагин будет обновлён.',
                                        BUTTON_ANIMATIONS_VERSION_CHECK_NEWER: (_version = '{version}') => `v${_version} - Ваша версия`,
                                        BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_NEWER_TITLE: 'Ваша версия новее',
                                        BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_NEWER_COMPARE: (_yourVersion, _ghVersion) => `v${_yourVersion} (ваша)  ←  v${_ghVersion} (github)`,
                                        BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_NEWER_NOTE: 'Плагин будет деобновлен.',
                                        BUTTON_ANIMATIONS_VERSION_CHECK_LATEST: (_version = '{version}') => `v${_version} - Последняя версия`,
                                        BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_LATEST_TITLE: 'Ваша версия последняя',
                                        BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_LATEST_COMPARE: (_yourVersion, _ghVersion) => `v${_yourVersion} (ваша)  ↔  v${_ghVersion} (github)`,
                                        BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_LATEST_NOTE: 'Плагин будет переустановлен.',
                                        BUTTON_ANIMATIONS_ISSUES: 'Проблемы',
                                        BUTTON_ANIMATIONS_SERVER: 'Сервер',
                                        BUTTON_ANIMATIONS_DISCUSSIONS: 'Обсуждения',
                                        BUTTON_LISTS_SWITCH: 'Списки',
                                        BUTTON_BUTTONS_SWITCH: 'Кнопки',
                                        BUTTON_MESSAGES_SWITCH: 'Сообщения',
                                        BUTTON_POPOUTS_SWITCH: 'Вспл. окна',
                                        BUTTON_RESET_LISTS: 'Сбросить списки',
                                        BUTTON_RESET_BUTTONS: 'Сбросить кнопки',
                                        BUTTON_RESET_MESSAGES: 'Сбросить сообщения',
                                        BUTTON_RESET_POPOUTS: 'Сбросить вспл. окна',
                                        BUTTON_SELECTORS_LISTS_DEFAULT: 'По умолчанию',
                                        BUTTON_SELECTORS_LISTS_CLEAR: 'Очистить',
                                        BUTTON_SELECTORS_BUTTONS_DEFAULT: 'По умолчанию',
                                        BUTTON_SELECTORS_BUTTONS_CLEAR: 'Очистить',
                                        BUTTON_SELECTORS_POPOUTS_DEFAULT: 'По умолчанию',
                                        BUTTON_SELECTORS_POPOUTS_CLEAR: 'Очистить',

                                        FIELD_NAME: 'Название',
                                        FIELD_SEQUENCE: 'Напраление',
                                        FIELD_DELAY: 'Задержка',
                                        FIELD_LIMIT: 'Лимит',
                                        FIELD_DURATION: 'Длительность',

                                        FIELD_LISTS_NAME_NOTE: (_default = '{default}') => `[${_default}] Название анимации элементов списка при их появлении.`,
                                        FIELD_LISTS_SEQUENCE_NOTE: (_default = '{default}') => `[${_default}] Направление в котором будут выстраиваться элементы списка.`,
                                        FIELD_LISTS_DELAY_NOTE: (_default = '{default}') => `[${_default}] Задержка перед появлением для каждого элемента списка в секундах.`,
                                        FIELD_LISTS_LIMIT_NOTE: (_default = '{default}') => `[${_default}] Максимальное количество элементов в списке, для которых будет воспроизводиться анимация.`,
                                        FIELD_LISTS_DURATION_NOTE: (_default = '{default}') => `[${_default}] Скорость воспроизведения анимации в секундах для каждого элемента списка после задержки.`,

                                        FIELD_BUTTONS_NAME_NOTE: (_default = '{default}') => `[${_default}] Название анимации кнопок при их появлении.`,
                                        FIELD_BUTTONS_SEQUENCE_NOTE: (_default = '{default}') => `[${_default}] Последовательность, в которой выстраиваются кнопки.`,
                                        FIELD_BUTTONS_DELAY_NOTE: (_default = '{default}') => `[${_default}] Задержка перед появлением каждой кнопки в секундах.`,
                                        FIELD_BUTTONS_DURATION_NOTE: (_default = '{default}') => `[${_default}] Скорость воспроизведения анимации в секундах для каждой кнопки после задержки.`,

                                        FIELD_MESSAGES_NAME_NOTE: (_default = '{default}') => `[${_default}] Название анимации сообщений при их появлении.`,
                                        FIELD_MESSAGES_DELAY_NOTE: (_default = '{default}') => `[${_default}] Задержка перед появлением каждого сообщения в секундах.`,
                                        FIELD_MESSAGES_LIMIT_NOTE: (_default = '{default}') => `[${_default}] Максимальное количество сообщений в списке, для которых будет воспроизводиться анимация.`,
                                        FIELD_MESSAGES_DURATION_NOTE: (_default = '{default}') => `[${_default}] Скорость воспроизведения анимации в секундах для каждого сообщения после задержки.`,

                                        FIELD_POPOUTS_NAME_NOTE: (_default = '{default}') => `[${_default}] Название анимации всплывающих окон при их появлении.`,
                                        FIELD_POPOUTS_DURATION_NOTE: (_default = '{default}') => `[${_default}] Скорость воспроизведения анимации в секундах для всплывающих окон.`,

                                        FIELD_LISTS_SELECTORS: 'Селекторы списков',
                                        FIELD_LISTS_SELECTORS_NOTE: 'Если оставить это поле пустым, при перезагрузке здесь будут отображаться селекторы по умолчанию. Изменения селекторов сохраняются при вводе (если код корректен). Разделителем является запятая (,).',
                                        FIELD_BUTTONS_SELECTORS: 'Селекторы кнопок',
                                        FIELD_BUTTONS_SELECTORS_NOTE: 'Если оставить это поле пустым, при перезагрузке здесь будут отображаться селекторы по умолчанию. Изменения селекторов сохраняются при вводе (если код корректен). Разделителем является запятая (,).',
                                        FIELD_POPOUTS_SELECTORS: 'Селекторы всплывающих окон',
                                        FIELD_POPOUTS_SELECTORS_NOTE: 'Если оставить это поле пустым, при перезагрузке здесь будут отображаться селекторы по умолчанию. Изменения селекторов сохраняются при вводе (если код корректен). Разделителем является запятая (,).',
                                        PREVIEW_SELECTING: 'Выбирать',
                                        PREVIEW_EDITING: 'Редактировать',
                                        PREVIEW_BUTTON_TEMPLATE: 'Шаблон',
                                        PREVIEW_BUTTON_CLEAR: 'Очистить',
                                        PREVIEW_BUTTON_LOAD: 'Загрузить',
                                        PREVIEW_BUTTON_SAVE: 'Сохранить',
                                        PREVIEW_IN: 'Вход',
                                        PREVIEW_OUT: 'Выход',
                                        PREVIEW_CIRCLE: 'Круг',
                                        PREVIEW_POLYGON: 'Полигон',
                                        PREVIEW_OPACITY: 'Прозрачность',
                                        PREVIEW_SLIME: 'Слизь',
                                        PREVIEW_BRICK_RIGHT: 'Кирпич враво',
                                        PREVIEW_BRICK_LEFT: 'Кирпич влево',
                                        PREVIEW_BRICK_UP: 'Кирпич вверх',
                                        PREVIEW_BRICK_DOWN: 'Кирпич вниз',
                                        PREVIEW_SLIDE_RIGHT: 'Скольжение вправо',
                                        PREVIEW_SLIDE_LEFT: 'Скольжение влево',
                                        PREVIEW_SLIDE_UP: 'Скольжение вверх',
                                        PREVIEW_SLIDE_DOWN: 'Скольжение вниз',
                                        PREVIEW_SLIDE_UP_RIGHT: 'Скольжение вверх (вправо)',
                                        PREVIEW_SLIDE_UP_LEFT: 'Скольжение вверх (влево)',
                                        PREVIEW_SLIDE_DOWN_RIGHT: 'Скольжение вниз (вправо)',
                                        PREVIEW_SLIDE_DOWN_LEFT: 'Скольжение вниз (влево)',
                                        PREVIEW_SKEW_RIGHT: 'Перекос вправо',
                                        PREVIEW_SKEW_LEFT: 'Перекос влево',
                                        PREVIEW_WIDE_SKEW_RIGHT: 'Широкий перекос вправо',
                                        PREVIEW_WIDE_SKEW_LEFT: 'Широкий перекос влево',

                                        PREVIEW_VERTICAL_FROM_FIRST: '↓',
                                        PREVIEW_VERTICAL_FROM_LAST: '↑',
                                        PREVIEW_HORIZONTAL_FROM_FIRST: '→',
                                        PREVIEW_HORIZONTAL_FROM_LAST: '←',

                                        GROUP_LISTS: 'Списки',
                                        GROUP_BUTTONS: 'Кнопки',
                                        GROUP_MESSAGES: 'Сообщения',
                                        GROUP_POPOUTS: 'Вспл. окна',

                                        GROUP_ADVANCED: 'Расширенные',
                                    }
                                }
                                break;

                            case 'ja':
                                TEMPS = {
                                    TOOLTIPS: {
                                        BUTTON_ANIMATIONS_VERSION_CHANGELOG: '最新の変更',
                                        BUTTON_ANIMATIONS_VERSION_CHECK: 'アップデートを確認',
                                        BUTTON_ANIMATIONS_RESET: '全設定をリセット',
                                        BUTTON_ANIMATIONS_REBUILD: 'スタイルを再作成します。プラグインを再起動すると、スタイルも再作成されます。',
                                        BUTTON_ANIMATIONS_ISSUES: 'GitHubへのリンク',
                                        BUTTON_ANIMATIONS_SERVER: 'Link to Discord',
                                        BUTTON_ANIMATIONS_DISCUSSIONS: 'GitHubへのリンク',
                                        BUTTON_LISTS_SWITCH: 'リスト切り替え',
                                        BUTTON_BUTTONS_SWITCH: 'ボタン切り替え',
                                        BUTTON_MESSAGES_SWITCH: 'メッセージ切り替え',
                                        BUTTON_POPOUTS_SWITCH: 'ポップアウト切り替え',
                                        BUTTON_RESET_LISTS: 'リストの設定をリセットする',
                                        BUTTON_RESET_BUTTONS: 'ボタンの設定をリセットする',
                                        BUTTON_RESET_MESSAGES: 'メッセージの設定をリセットする',
                                        BUTTON_RESET_POPOUTS: 'ポップアウトの設定をリセットする',
                                        BUTTON_SELECTORS_LISTS_DEFAULT: 'デフォルトのセレクタに戻す',
                                        BUTTON_SELECTORS_LISTS_CLEAR: 'テキストエリアをクリアする',
                                        BUTTON_SELECTORS_BUTTONS_DEFAULT: 'デフォルトのセレクタに戻す',
                                        BUTTON_SELECTORS_BUTTONS_CLEAR: 'テキストエリアをクリアする',
                                        BUTTON_SELECTORS_POPOUTS_DEFAULT: 'デフォルトのセレクタに戻す',
                                        BUTTON_SELECTORS_POPOUTS_CLEAR: 'テキストエリアをクリアする'
                                    },
                                    LABELS: {
                                        BUTTON_ANIMATIONS_RESET: 'すべてリセット',
                                        BUTTON_ANIMATIONS_RESET_RESETING: 'リセット...',
                                        BUTTON_ANIMATIONS_REBUILD: 'アニメーションの再構築',
                                        BUTTON_ANIMATIONS_VERSION_CHANGELOG: '変更履歴',
                                        BUTTON_ANIMATIONS_VERSION_CHECK: 'アップデート',
                                        BUTTON_ANIMATIONS_VERSION_CHECK_SEARCHING: 'アップデートを調べる...',
                                        BUTTON_ANIMATIONS_VERSION_CHECK_TIMEOUT: 'タイムアウトを超過しました',
                                        BUTTON_ANIMATIONS_VERSION_CHECK_ERROR: 'エラーが発生しました',
                                        BUTTON_ANIMATIONS_VERSION_CHECK_OLDER: (_version = '{version}') => `v${_version} - Update`,
                                        BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_OLDER_TITLE: 'あなたのバージョンは古いです',
                                        BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_OLDER_COMPARE: (_yourVersion, _ghVersion) => `v${_yourVersion} (your)  →  v${_ghVersion} (github)`,
                                        BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_OLDER_NOTE: 'プラグインはアップデートされます',
                                        BUTTON_ANIMATIONS_VERSION_CHECK_NEWER: (_version = '{version}') => `v${_version} - Your own version`,
                                        BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_NEWER_TITLE: 'あなたのバージョンは最新です',
                                        BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_NEWER_COMPARE: (_yourVersion, _ghVersion) => `v${_yourVersion} (your)  ←  v${_ghVersion} (github)`,
                                        BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_NEWER_NOTE: 'プラグインはダウンデートされます',
                                        BUTTON_ANIMATIONS_VERSION_CHECK_LATEST: (_version = '{version}') => `v${_version} - Latest version`,
                                        BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_LATEST_TITLE: 'あなたのバージョンは最新です',
                                        BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_LATEST_COMPARE: (_yourVersion, _ghVersion) => `v${_yourVersion} (your)  ↔  v${_ghVersion} (github)`,
                                        BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_LATEST_NOTE: 'プラグインが復元されます',
                                        BUTTON_ANIMATIONS_ISSUES: '問題',
                                        BUTTON_ANIMATIONS_SERVER: 'Server',
                                        BUTTON_ANIMATIONS_DISCUSSIONS: '議論',
                                        BUTTON_LISTS_SWITCH: 'リスト',
                                        BUTTON_BUTTONS_SWITCH: 'ボタン',
                                        BUTTON_MESSAGES_SWITCH: 'メッセージ',
                                        BUTTON_POPOUTS_SWITCH: 'ポップアウト',
                                        BUTTON_RESET_LISTS: 'リストをリセット',
                                        BUTTON_RESET_BUTTONS: 'ボタンをリセット',
                                        BUTTON_RESET_MESSAGES: 'メッセージをリセット',
                                        BUTTON_RESET_POPOUTS: 'ポップアウトをリセット',
                                        BUTTON_SELECTORS_LISTS_DEFAULT: 'デフォルト',
                                        BUTTON_SELECTORS_LISTS_CLEAR: 'クリア',
                                        BUTTON_SELECTORS_BUTTONS_DEFAULT: 'デフォルト',
                                        BUTTON_SELECTORS_BUTTONS_CLEAR: 'クリア',
                                        BUTTON_SELECTORS_POPOUTS_DEFAULT: 'デフォルト',
                                        BUTTON_SELECTORS_POPOUTS_CLEAR: 'クリア',

                                        FIELD_NAME: '名前',
                                        FIELD_SEQUENCE: '構築',
                                        FIELD_DELAY: '遅延',
                                        FIELD_LIMIT: '表示数',
                                        FIELD_DURATION: '時間',

                                        FIELD_LISTS_NAME_NOTE: (_default = '{default}') => `[デフォルト:${_default}] リストが表示されるときのアニメーションの名前。`,
                                        FIELD_LISTS_SEQUENCE_NOTE: (_default = '{default}') => `[デフォルト:${_default}] リストを構築する順序。`,
                                        FIELD_LISTS_DELAY_NOTE: (_default = '{default}') => `[デフォルト:${_default}] 各リストが表示されるまでの遅延時間(秒)。`,
                                        FIELD_LISTS_LIMIT_NOTE: (_default = '{default}') => `[デフォルト:${_default}] アニメーションを再生するリスト内の最大項目数。`,
                                        FIELD_LISTS_DURATION_NOTE: (_default = '{default}') => `[デフォルト:${_default}] 遅延後の各リストのアニメーションの再生速度(秒)。`,

                                        FIELD_BUTTONS_NAME_NOTE: (_default = '{default}') => `[デフォルト:${_default}] ボタンが表示されるときのアニメーションの名前。`,
                                        FIELD_BUTTONS_SEQUENCE_NOTE: (_default = '{default}') => `[デフォルト:${_default}] ボタンを構築する順序。`,
                                        FIELD_BUTTONS_DELAY_NOTE: (_default = '{default}') => `[デフォルト:${_default}] 各ボタンが表示されるまでの遅延時間(秒)。`,
                                        FIELD_BUTTONS_DURATION_NOTE: (_default = '{default}') => `[デフォルト:${_default}] 遅延後の各ボタンのアニメーションの再生速度(秒)。`,

                                        FIELD_MESSAGES_NAME_NOTE: (_default = '{default}') => `[デフォルト:${_default}] メッセージが表示されるときのアニメーションの名前。`,
                                        FIELD_MESSAGES_DELAY_NOTE: (_default = '{default}') => `[デフォルト:${_default}] 各メッセージが表示されるまでの遅延時間(秒)。`,
                                        FIELD_MESSAGES_LIMIT_NOTE: (_default = '{default}') => `[デフォルト:${_default}] アニメーションが再生されるリスト内のメッセージの最大数。`,
                                        FIELD_MESSAGES_DURATION_NOTE: (_default = '{default}') => `[デフォルト:${_default}] 遅延後の各メッセージのアニメーションの再生速度(秒)。`,

                                        FIELD_POPOUTS_NAME_NOTE: (_default = '{default}') => `[デフォルト:${_default}] ポップアップが表示されるときのアニメーションの名前。`,
                                        FIELD_POPOUTS_DURATION_NOTE: (_default = '{default}') => `[デフォルト:${_default}] ポップアウトのアニメーションの再生速度(秒)。`,

                                        FIELD_LISTS_SELECTORS: 'リストのセレクタ',
                                        FIELD_LISTS_SELECTORS_NOTE: 'このフィールドを空にすると、再読み込み時にデフォルトのセレクタがここに表示されます。セレクタの変更は、入力時に保存されます(コードが有効である場合)。セパレータはカンマ(,)です。',
                                        FIELD_BUTTONS_SELECTORS: 'ボタンのセレクタ',
                                        FIELD_BUTTONS_SELECTORS_NOTE: 'このフィールドを空にすると、再読み込み時にデフォルトのセレクタがここに表示されます。セレクタの変更は、入力時に保存されます(コードが有効である場合)。セパレータはカンマ(,)です。',
                                        FIELD_POPOUTS_SELECTORS: 'ポップアウトのセレクタ',
                                        FIELD_POPOUTS_SELECTORS_NOTE: 'このフィールドを空にすると、再読み込み時にデフォルトのセレクタがここに表示されます。セレクタの変更は、入力時に保存されます(コードが有効である場合)。セパレータはカンマ(,)です。',

                                        PREVIEW_SELECTING: '選択',
                                        PREVIEW_EDITING: '編集',
                                        PREVIEW_BUTTON_TEMPLATE: 'テンプレート',
                                        PREVIEW_BUTTON_CLEAR: '削除',
                                        PREVIEW_BUTTON_LOAD: '読込',
                                        PREVIEW_BUTTON_SAVE: '保存',
                                        PREVIEW_IN: 'In',
                                        PREVIEW_OUT: 'Out',
                                        PREVIEW_CIRCLE: 'Circle',
                                        PREVIEW_POLYGON: 'Polygon',
                                        PREVIEW_OPACITY: 'Opacity',
                                        PREVIEW_SLIME: 'Slime',
                                        PREVIEW_BRICK_RIGHT: 'Brick right',
                                        PREVIEW_BRICK_LEFT: 'Brick left',
                                        PREVIEW_BRICK_UP: 'Brick up',
                                        PREVIEW_BRICK_DOWN: 'Brick down',
                                        PREVIEW_SLIDE_RIGHT: 'Slide right',
                                        PREVIEW_SLIDE_LEFT: 'Slide left',
                                        PREVIEW_SLIDE_UP: 'Slide up',
                                        PREVIEW_SLIDE_DOWN: 'Slide down',
                                        PREVIEW_SLIDE_UP_RIGHT: 'Slide up (right)',
                                        PREVIEW_SLIDE_UP_LEFT: 'Slide up (left)',
                                        PREVIEW_SLIDE_DOWN_RIGHT: 'Slide down (right)',
                                        PREVIEW_SLIDE_DOWN_LEFT: 'Slide down (left)',
                                        PREVIEW_SKEW_RIGHT: 'Skew right',
                                        PREVIEW_SKEW_LEFT: 'Skew left',
                                        PREVIEW_WIDE_SKEW_RIGHT: 'Wide skew right',
                                        PREVIEW_WIDE_SKEW_LEFT: 'Wide skew left',

                                        PREVIEW_VERTICAL_FROM_FIRST: '↓',
                                        PREVIEW_VERTICAL_FROM_LAST: '↑',
                                        PREVIEW_HORIZONTAL_FROM_FIRST: '→',
                                        PREVIEW_HORIZONTAL_FROM_LAST: '←',

                                        GROUP_LISTS: 'リスト',
                                        GROUP_BUTTONS: 'ボタン',
                                        GROUP_MESSAGES: 'メッセージ',
                                        GROUP_POPOUTS: 'ポップアウト',

                                        GROUP_ADVANCED: '高度',
                                    }
                                }
                                break;

                            case 'zh-TW':
                                TEMPS = {
                                    TOOLTIPS: {
                                        BUTTON_ANIMATIONS_VERSION_CHANGELOG: '最近更新',
                                        BUTTON_ANIMATIONS_VERSION_CHECK: '檢查更新',
                                        BUTTON_ANIMATIONS_RESET: '重設所有設定',
                                        BUTTON_ANIMATIONS_REBUILD: '重新生成樣式。當插件重新啟動時，樣式也會重新生成',
                                        BUTTON_ANIMATIONS_ISSUES: '前往GitHub',
                                        BUTTON_ANIMATIONS_SERVER: 'Link to Discord',
                                        BUTTON_ANIMATIONS_DISCUSSIONS: '前往GitHub',
                                        BUTTON_LISTS_SWITCH: '列表開關',
                                        BUTTON_BUTTONS_SWITCH: '按鈕開關',
                                        BUTTON_MESSAGES_SWITCH: '訊息開關',
                                        BUTTON_POPOUTS_SWITCH: '彈出視窗開關',
                                        BUTTON_RESET_LISTS: '重設列表設定',
                                        BUTTON_RESET_BUTTONS: '重設按鈕設定',
                                        BUTTON_RESET_MESSAGES: '重設訊息設定',
                                        BUTTON_RESET_POPOUTS: '重設彈出視窗設定',
                                        BUTTON_SELECTORS_LISTS_DEFAULT: '恢復至預設值',
                                        BUTTON_SELECTORS_LISTS_CLEAR: '清除所有選擇',
                                        BUTTON_SELECTORS_BUTTONS_DEFAULT: '恢復至預設值',
                                        BUTTON_SELECTORS_BUTTONS_CLEAR: '清除所有選擇',
                                        BUTTON_SELECTORS_POPOUTS_DEFAULT: '恢復至預設值',
                                        BUTTON_SELECTORS_POPOUTS_CLEAR: '清除所有選擇'
                                    },
                                    LABELS: {
                                        BUTTON_ANIMATIONS_RESET: '重設所有設定',
                                        BUTTON_ANIMATIONS_RESET_RESETING: '重設中...',
                                        BUTTON_ANIMATIONS_REBUILD: '重新生成動畫',
                                        BUTTON_ANIMATIONS_VERSION_CHANGELOG: '更新日誌',
                                        BUTTON_ANIMATIONS_VERSION_CHECK: '檢查更新',
                                        BUTTON_ANIMATIONS_VERSION_CHECK_SEARCHING: '檢查更新中...',
                                        BUTTON_ANIMATIONS_VERSION_CHECK_TIMEOUT: '超時',
                                        BUTTON_ANIMATIONS_VERSION_CHECK_ERROR: '發生錯誤',
                                        BUTTON_ANIMATIONS_VERSION_CHECK_OLDER: (_version = '{version}') => `v${_version} - 更新`,
                                        BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_OLDER_TITLE: '您當前的版本較舊',
                                        BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_OLDER_COMPARE: (_yourVersion, _ghVersion) => `v${_yourVersion} (您的)  →  v${_ghVersion} (github)`,
                                        BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_OLDER_NOTE: '插件將會更新',
                                        BUTTON_ANIMATIONS_VERSION_CHECK_NEWER: (_version = '{version}') => `v${_version} - 您的版本`,
                                        BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_NEWER_TITLE: '您當前的版本較新',
                                        BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_NEWER_COMPARE: (_yourVersion, _ghVersion) => `v${_yourVersion} (您的)  ←  v${_ghVersion} (github)`,
                                        BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_NEWER_NOTE: '插件將會降級',
                                        BUTTON_ANIMATIONS_VERSION_CHECK_LATEST: (_version = '{version}') => `v${_version} - 最新版本`,
                                        BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_LATEST_TITLE: '您當前的版本為最新',
                                        BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_LATEST_COMPARE: (_yourVersion, _ghVersion) => `v${_yourVersion} (您的)  ↔  v${_ghVersion} (github)`,
                                        BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_LATEST_NOTE: '插件將會恢復',
                                        BUTTON_ANIMATIONS_ISSUES: '發生錯誤了?',
                                        BUTTON_ANIMATIONS_SERVER: 'Server',
                                        BUTTON_ANIMATIONS_DISCUSSIONS: '討論',
                                        BUTTON_LISTS_SWITCH: '列表',
                                        BUTTON_BUTTONS_SWITCH: '按鈕',
                                        BUTTON_MESSAGES_SWITCH: '訊息',
                                        BUTTON_POPOUTS_SWITCH: '彈出視窗',
                                        BUTTON_RESET_LISTS: '重設列表',
                                        BUTTON_RESET_BUTTONS: '重設按鈕',
                                        BUTTON_RESET_MESSAGES: '重設訊息',
                                        BUTTON_RESET_POPOUTS: '重設彈出視窗',
                                        BUTTON_SELECTORS_LISTS_DEFAULT: '預設值',
                                        BUTTON_SELECTORS_LISTS_CLEAR: '清除',
                                        BUTTON_SELECTORS_BUTTONS_DEFAULT: '預設值',
                                        BUTTON_SELECTORS_BUTTONS_CLEAR: '清除',
                                        BUTTON_SELECTORS_POPOUTS_DEFAULT: '預設值',
                                        BUTTON_SELECTORS_POPOUTS_CLEAR: '清除',

                                        FIELD_NAME: '行式',
                                        FIELD_SEQUENCE: '順序',
                                        FIELD_DELAY: '延遲',
                                        FIELD_LIMIT: '限制',
                                        FIELD_DURATION: '持續時間',

                                        FIELD_LISTS_NAME_NOTE: (_default = '{default}') => `[${_default}] 列表項的動畫行式`,
                                        FIELD_LISTS_SEQUENCE_NOTE: (_default = '{default}') => `[${_default}] 生成列表項的順序`,
                                        FIELD_LISTS_DELAY_NOTE: (_default = '{default}') => `[${_default}] 每個列表項出現前的延遲（以秒為單位）`,
                                        FIELD_LISTS_LIMIT_NOTE: (_default = '{default}') => `[${_default}] 列表中將播放動畫的最大項目數`,
                                        FIELD_LISTS_DURATION_NOTE: (_default = '{default}') => `[${_default}] 延遲後每個列表項的動畫播放速度（以秒為單位）`,

                                        FIELD_BUTTONS_NAME_NOTE: (_default = '{default}') => `[${_default}] 按鈕項的動畫行式`,
                                        FIELD_BUTTONS_SEQUENCE_NOTE: (_default = '{default}') => `[${_default}] 生成按鈕項的順序`,
                                        FIELD_BUTTONS_DELAY_NOTE: (_default = '{default}') => `[${_default}] 每個按鈕項出現前的延遲（以秒為單位）`,
                                        FIELD_BUTTONS_DURATION_NOTE: (_default = '{default}') => `[${_default}] 延遲後每個按鈕項的動畫播放速度（以秒為單位）`,

                                        FIELD_MESSAGES_NAME_NOTE: (_default = '{default}') => `[${_default}] 訊息項的動畫行式`,
                                        FIELD_MESSAGES_DELAY_NOTE: (_default = '{default}') => `[${_default}] 每個訊息項出現前的延遲（以秒為單位）`,
                                        FIELD_MESSAGES_LIMIT_NOTE: (_default = '{default}') => `[${_default}] 訊息中將播放動畫的最大項目數.`,
                                        FIELD_MESSAGES_DURATION_NOTE: (_default = '{default}') => `[${_default}] 延遲後每個訊息項的動畫播放速度（以秒為單位）`,

                                        FIELD_POPOUTS_NAME_NOTE: (_default = '{default}') => `[${_default}] 彈出視窗的動畫行式`,
                                        FIELD_POPOUTS_DURATION_NOTE: (_default = '{default}') => `[${_default}] 彈出視窗的動畫播放速度（以秒為單位）。`,

                                        FIELD_LISTS_SELECTORS: '列表項名單',
                                        FIELD_LISTS_SELECTORS_NOTE: '如果您將此字段留空，則預設值將在重新加載時出現在此處。輸入時會保存對名單的更改（如果代碼有效）。分隔符是半形逗號 (,)',
                                        FIELD_BUTTONS_SELECTORS: '按鈕項名單',
                                        FIELD_BUTTONS_SELECTORS_NOTE: '如果您將此字段留空，則預設值將在重新加載時出現在此處。輸入時會保存對名單的更改（如果代碼有效）。分隔符是半形逗號 (,)',
                                        FIELD_POPOUTS_SELECTORS: '彈出視窗名單',
                                        FIELD_POPOUTS_SELECTORS_NOTE: '如果您將此字段留空，則預設值將在重新加載時出現在此處。輸入時會保存對名單的更改（如果代碼有效）。分隔符是半形逗號 (,)',

                                        PREVIEW_SELECTING: '選擇',
                                        PREVIEW_EDITING: '編輯',
                                        PREVIEW_BUTTON_TEMPLATE: '樣板',
                                        PREVIEW_BUTTON_CLEAR: '清除',
                                        PREVIEW_BUTTON_LOAD: '載入',
                                        PREVIEW_BUTTON_SAVE: '儲存',
                                        PREVIEW_IN: '由內往外',
                                        PREVIEW_OUT: '由外往內',
                                        PREVIEW_CIRCLE: '圓形展開',
                                        PREVIEW_POLYGON: '多邊形展開',
                                        PREVIEW_OPACITY: '淡入',
                                        PREVIEW_SLIME: '史萊姆',
                                        PREVIEW_BRICK_RIGHT: '由左滑入',
                                        PREVIEW_BRICK_LEFT: '由右滑入',
                                        PREVIEW_BRICK_UP: '由下滑入',
                                        PREVIEW_BRICK_DOWN: '由上滑入',
                                        PREVIEW_SLIDE_RIGHT: '由左填滿',
                                        PREVIEW_SLIDE_LEFT: '由右填滿',
                                        PREVIEW_SLIDE_UP: '由下填滿',
                                        PREVIEW_SLIDE_DOWN: '由上填滿',
                                        PREVIEW_SLIDE_UP_RIGHT: '由左下往右上填滿',
                                        PREVIEW_SLIDE_UP_LEFT: '由右下往左上填滿',
                                        PREVIEW_SLIDE_DOWN_RIGHT: '由左上往右下填滿',
                                        PREVIEW_SLIDE_DOWN_LEFT: '由右上往左下填滿',
                                        PREVIEW_SKEW_RIGHT: '向右旋轉',
                                        PREVIEW_SKEW_LEFT: '向左旋轉',
                                        PREVIEW_WIDE_SKEW_RIGHT: '向右旋轉(寬)',
                                        PREVIEW_WIDE_SKEW_LEFT: '向左旋轉(寬)',

                                        PREVIEW_VERTICAL_FROM_FIRST: '↓',
                                        PREVIEW_VERTICAL_FROM_LAST: '↑',
                                        PREVIEW_HORIZONTAL_FROM_FIRST: '→',
                                        PREVIEW_HORIZONTAL_FROM_LAST: '←',

                                        GROUP_LISTS: '列表',
                                        GROUP_BUTTONS: '按鈕',
                                        GROUP_MESSAGES: '訊息',
                                        GROUP_POPOUTS: '彈出視窗',

                                        GROUP_ADVANCED: '進階選項',
                                    }
                                }
                                break;

                            case 'en-US':
                            case 'en-GB':
                            default:
                                // look up
                                break;
                        }

                        /**
                     * Returns object - `class`, `render`.
                     * @param {Array<{elements: Array<ElementButtonTemp>, options: object}>} containersTemp Array with button container templates.
                     * @param {object} options Panel optinons.
                     * @param {string} [options.widthAll] The width of each button, if the template does not specify a different width.
                     * @param {string} [options.heightAll] The height of each button, if the template does not specify a different height.
                     * @param {string} [options.align="flex-start"] `justify-content` css value for each button container.
                     * @param {boolean} [options.nosidemargin=true] Zeroing the left and right margins for the first and last button respectively.
                     */

                        var ElementsPanel = (containersTemp = [], options = {}) => {



                            class ElementButton extends React.Component {

                                /**
                                 * 
                                 * @param {object} button
                                 * @param {string} [button.width='fit-content']
                                 * @param {string} [button.height='fit-content']
                                 * @param {string} [button.padding='8px']
                                 * @param {string} [button.margin='8px']
                                 * @param {string} [button.id='']
                                 * @param {string} [button.class='']
                                 * @param {boolean} [button.disabled=false]
                                 * @param {string} [button.link=null]
                                 * @param {string | 'filled' | 'inverted' | 'underline'} [button.fill='filled'] ` filled ` | ` inverted ` | ` underline `
                                 * @param {string | 'blurple' | 'grey' | 'green' | 'yellow' | 'red' | 'white'} [button.color='blurple'] ` filled ` | ` inverted ` | ` underline `
                                 * @param {(e:MouseEvent)=>void} [button.onclick=null]
                                 */

                                constructor(button) {
                                    super(button)
                                    this.state = button
                                }

                                render() {
                                    class SvgElement extends React.Component {

                                        constructor(props) {
                                            super(props)
                                            this.paths = props.paths ?? []
                                            this.color = props.color ?? '#fff'
                                            this.width = props.width ?? '16px'
                                            this.height = props.height ?? '16px'
                                            this.align = props.align ?? false
                                            this.viewBox = props.viewBox ?? '0 0 24 24'
                                        }

                                        render() {

                                            return React.createElement('svg',
                                                {
                                                    viewBox: this.viewBox,
                                                    fill: this.color,
                                                    style: {
                                                        width: this.width,
                                                        height: this.height,
                                                        position: (['right', 'left']).includes(this.align) ? 'absolute' : 'relative',
                                                        right: (this.align == 'right') ? '12px' : 'none',
                                                        left: (this.align == 'left') ? '12px' : 'none',
                                                        'margin-right': '4px'
                                                    }
                                                },
                                                this.paths.map(path => React.createElement('path', { d: path }))
                                            )
                                        }
                                    }

                                    var button = this.state;
                                    return React.createElement('button', {
                                        style: {
                                            display: 'inline-block',
                                            width: button.width ?? 'fit-content',
                                            height: button.height ?? 'fit-content',
                                            padding: button.padding ?? '8px',
                                            margin: button.margin ?? '8px',
                                            'transition': 'background-color .17s ease, color .17s ease, opacity 250ms ease',
                                        },
                                        id: button.id ?? '',
                                        class: `animButton ${AnimationsPlugin.modules.Button} ${AnimationsPlugin.modules.ButtonSizeSmall} ${button.disabled ? 'disabled' : ''} ${(['filled', 'inverted', 'underline']).includes(button.fill) ? button.fill : 'filled'} ${button.color ?? 'blurple'} ${button.class ?? ''}`,
                                        onClick: (e) => {
                                            if (e.currentTarget.classList.contains('disabled')) return
                                            if (typeof button.onclick == 'function') button.onclick(e)
                                            if (typeof button.link == 'string') window.open(button.link)
                                        }
                                    },
                                        React.createElement('div', {
                                            style: {
                                                'pointer-events': 'none',
                                                'display': 'flex',
                                                'align-items': 'center',
                                                'justify-content': 'center'
                                            }
                                        },
                                            [
                                                Array.isArray(button.svgs) ? button.svgs.map((svgTemp) => React.createElement(SvgElement, svgTemp)) : null,
                                                React.createElement('span', {
                                                    style: {
                                                        'max-width': 'none'
                                                    },
                                                    class: `${AnimationsPlugin.modules.ButtonText} ${AnimationsPlugin.modules.ButtonContents}`,
                                                },
                                                    button.label
                                                ),
                                                typeof button.link == 'string' ? React.createElement(SvgElement, {
                                                    ...SvgTemps.linkArrow,
                                                    align: 'right'
                                                }) : null
                                            ]
                                        )
                                    )
                                }
                            }

                            /**
                             * 
                             * @param {object} input
                             * @param {string} [input.width='100%']
                             * @param {string} [input.height='fit-content']
                             * @param {string} [input.padding='8px']
                             * @param {string} [input.margin='8px']
                             * @param {string} [input.id='']
                             * @param {string} [input.class='']
                             * @param {boolean} [input.disabled=false]
                             * @param {string} [input.placeholder='']
                             * @param {number | ''} [input.maxlength='']
                             * @param {number | ''} [input.size='']
                             * @param {number | ''} [input.step=0.01]
                             * @param {string} [input.value='']
                             * @param {string | 'filled' | 'inverted' | 'underline'} [input.type='filled'] ` filled ` | ` inverted ` | ` underline `
                             * @param {(e:MouseEvent)=>void} [button.onclick=null]
                             */

                            class ElementInput extends React.Component {

                                constructor(input) {
                                    super(input)
                                    this.state = input
                                }

                                render() {
                                    var input = this.state;
                                    return React.createElement('input',
                                        {
                                            style: {
                                                display: 'inline-block',
                                                width: input.width ?? '100%',
                                                height: input.height ?? 'fit-content',
                                                padding: input.padding ?? '8px',
                                                margin: input.margin ?? '8px',
                                            },
                                            placeholder: input.placeholder ?? '',
                                            maxlength: input.maxlength ?? '',
                                            max: input.max ?? '',
                                            min: input.min ?? '0',
                                            size: input.size ?? '',
                                            step: input.step ?? 0.01,
                                            value: input.value ?? '',
                                            type: (['text', 'password', 'email', 'number', 'integer']).includes(input.type) ? (input.type == 'integer' ? 'number' : input.type) : 'text',
                                            id: input.id ?? '',
                                            class: `animInput ${AnimationsPlugin.modules.InputDefault} ${input.disabled ? 'disabled' : ''} ${input.class ?? ''}`,
                                            onClick: input.onclick ?? null,
                                            onChange: (e) => {
                                                var value = e.currentTarget.value
                                                var valueNum = e.currentTarget.valueAsNumber

                                                if ((['number', 'integer']).includes(input.type) && !(/(\d*,)/).test(value) && value != '') {
                                                    valueNum = (valueNum <= (input.max ?? Infinity) ? valueNum : input.max)
                                                    valueNum = (valueNum >= (input.min ?? 0) ? valueNum : input.min ?? 0)
                                                    valueNum = (input.type == 'integer' ? Math.floor(valueNum) : valueNum)
                                                }
                                                var newValue = String(value)

                                                this.setState({
                                                    ...input,
                                                    value: newValue
                                                })

                                                input?.onchange(e, value)
                                            }
                                        }
                                    )
                                }
                            }

                            var result = React.createElement('div', {
                                style: {
                                    display: 'flex',
                                    width: '100%',
                                    'flex-direction': 'column',
                                    'justify-content': options.align ?? 'inline-flex'
                                },
                                class: `elementsPanel`
                            },
                                containersTemp?.map(
                                    containerTemp =>
                                        React.createElement('div',
                                            {
                                                style: {
                                                    display: 'inline-flex',
                                                    width: '100%',
                                                    'justify-content': options.align ?? containerTemp.options?.align ?? 'flex-start'
                                                },
                                                class: `elementsContainer ${options.nosidemargin ?? containerTemp.options?.nosidemargin ?? true ? 'nosidemargin' : ''}`
                                            },
                                            containerTemp.elements?.map(
                                                elementTemp => {
                                                    switch (elementTemp.component) {
                                                        case 'divider':
                                                            return (
                                                                React.createElement('div', { class: 'animFieldDivider' })
                                                            )
                                                        //break;

                                                        case 'button':
                                                            return (
                                                                React.createElement(ElementButton, {
                                                                    width: options.widthAll ?? containerTemp.options?.widthAll,
                                                                    height: options.heightAll ?? containerTemp.options?.heightAll,
                                                                    margin: options.marginAll ?? containerTemp.options?.marginAll,
                                                                    padding: options.paddingAll ?? containerTemp.options?.paddingAll,
                                                                    ...elementTemp
                                                                })
                                                            )
                                                        //break;

                                                        case 'input':
                                                            return (
                                                                React.createElement(ElementInput, {
                                                                    width: options.widthAll ?? containerTemp.options?.widthAll,
                                                                    height: options.heightAll ?? containerTemp.options?.heightAll,
                                                                    margin: options.marginAll ?? containerTemp.options?.marginAll,
                                                                    padding: options.paddingAll ?? containerTemp.options?.paddingAll,
                                                                    ...elementTemp
                                                                })
                                                            )
                                                        //break;
                                                    }
                                                }
                                            )
                                        )
                                )
                            )

                            class Panel extends React.Component {
                                render() {
                                    return result
                                }
                            }

                            return { class: Panel, render: result };
                        }

                        /**
                         * Returns object - `class`, `render`.
                         * @param {object} options TextareasPanel options.
                         * @param {string} [options.margin]
                         * @param {string} [options.padding]
                         * @param {string} [options.class]
                         * @param {object} [options.elementsPanel] ElementsPanel.
                         * @param {Array<object>} [options.elementsPanel.containersTemp] Array with element container templates.
                         * @param {object} [options.elementsPanel.options] ElementsPanel options.
                         * @param {string} [options.elementsPanel.options.widthAll] The width of each element, if the template does not specify a different width.
                         * @param {string} [options.elementsPanel.options.heightAll] The height of each element, if the template does not specify a different height.
                         * @param {string} [options.elementsPanel.options.marginAll] The margin of each element, if the template does not specify a different height.
                         * @param {string} [options.elementsPanel.options.paddingAll] The padding of each element, if the template does not specify a different height.
                         * @param {string} [options.elementsPanel.options.align="inline-flex"] `justify-content` css value for each element container. Default - `flex-start`.
                         * @param {Array<object>} [options.textareas] Textareas temps.
                         * @param {(e:InputEvent)=>void} [options.onchange] The event at each change of any of the textareas.
                         * @param {(e:MouseEvent)=>void} [options.onclick] The event at each click of any point.
                         */

                        var TextareasPanel = (options = {}) => {

                            var result = React.createElement('div', {
                                style: {
                                    margin: options.margin ?? null,
                                    padding: options.padding ?? null
                                },
                                class: `animTextareasPanel ${options.class}`,
                                onClick: (e) => {
                                    options.onclick?.(e)
                                }
                            },
                                [
                                    options.elementsPanel ? (ElementsPanel(options.elementsPanel.containersTemp, options.elementsPanel.options ?? {}).render) : null,
                                    ...options.textareas?.map(
                                        textarea => React.createElement('textarea',
                                            {
                                                style: {
                                                    height: textarea?.height ?? '270px',
                                                    width: textarea?.width ?? '100%'
                                                },
                                                spellcheck: 'false',
                                                type: textarea?.type ?? 'text',
                                                placeholder: textarea?.placeholder ?? '',
                                                class: `animTextarea ${textarea?.disabled ? 'disabled' : ''} ${textarea?.invalid ? 'invalid' : ''} ${textarea?.class ?? ''} ${AnimationsPlugin.modules.InputDefault} ${AnimationsPlugin.modules.TextArea} ${AnimationsPlugin.modules.ScrollbarDefault}`,
                                                onChange: (e) => {
                                                    textarea.onchange?.(e)
                                                    options.onchange?.(e)
                                                },
                                                onClick: (e) => {
                                                    textarea.onclick?.(e)
                                                }
                                            },
                                            textarea.value
                                        )
                                    )
                                ]
                            )

                            class Panel extends React.Component {
                                render() {
                                    return result
                                }
                            }

                            return { class: Panel, render: result }
                        }

                        /**
                         * Returns object - `class`, `render`.
                         * @param {Array<object>} previewsTemp Array with previews templates.
                         * @param {object} options Panel optinons.
                         * @param {boolean} horizontal Preview positioning.
                         * @param {string} [options.type] `*class*-name`, `*class*-sequence`, ...
                         * @param {string} [options.class] `lists`, `messages`, `buttons`
                         * @param {object} [options.custom] Editor options.
                         * @param {boolean} [options.custom.enabled] Editor availability.
                         * @param {Array<object>} [options.custom.frames] Editor frames default.
                         * @param {number} [options.custom.page] Editor page default.
                         * @param {number} [options.custom.data] Editor data `this.settings.*type*.custom`.
                         * @param {object} [options.tempBlocks] TempBlocks options.
                         * @param {string} [options.tempBlocks.count=4] TempBlocks count.
                         * @param {string} [options.tempBlocks.margin='4px'] TempBlocks margin.
                         * @param {string} [options.tempBlocks.height] TempBlock height.
                         * @param {string} [options.tempBlocks.width] TempBlock width.
                         * @param {(e:MouseEvent)=>void} [onclick]
                         * @param {string} value One of the values of `previevsTemp`
                         */

                        var PreviewsPanel = (previewsTemp = [], options = {}, value, onclick) => {

                            var swipeButtonsDefault = [];
                            var swipeButtonsCustom = [];
                            var previews = [];
                            var containers = [];
                            var textareas = [];
                            var openedPage = 0;
                            var containersCount = 0;
                            var previewsCountOnPage = (options?.horizontal ? 6 : 8);

                            if (options?.custom)
                                if (this.settings[options.class].custom.enabled)
                                    if (!(this.settings[options.class].custom.page >= 0 ? this.isValidKeyframe(this.settings[options.class].custom.frames[this.settings[options.class].custom.page]?.anim) : 0)) {
                                        this.settings[options.class].custom.enabled = false;
                                        PluginUtilities.saveSettings(this.getName(), this.settings);
                                    }

                            previewsTemp.forEach((template, index) => {

                                class Preview extends React.Component {

                                    constructor(props) {
                                        super(props)
                                        this.enabled = props.enabled
                                        this.template = props.template
                                        this.page = props.page
                                    }

                                    render() {

                                        var tempBlocks = []
                                        var tempCount = ((typeof options?.tempBlocks?.count == 'number') ? options.tempBlocks.count : 4)

                                        for (var i = 0; i < tempCount; i++) {
                                            tempBlocks[i] = React.createElement('div', {
                                                class: 'animTempBlock',
                                                style: {
                                                    width: options?.tempBlocks?.width ?? (options?.horizontal ? '100%' : 'auto'),
                                                    height: options?.tempBlocks?.height ?? (options?.horizontal ? '26px' : '18%'),
                                                    margin: options?.tempBlocks?.margin ?? (options?.horizontal ? '0 4px' : '4px')
                                                }
                                            })
                                        }

                                        return React.createElement('div', {
                                            'pdata': this.template.value + ',' + options.class,
                                            class: `animPreview ${AnimationsPlugin.modules.CodeRedemptionRedirect} ${AnimationsPlugin.modules.Card} ${this.enabled ? 'enabled' : ''}`,
                                            onClick: (e) => {
                                                onclick({ value: this.template.value, page: this.page });

                                                var sections = document.querySelectorAll(`[data-type="${options.type}"] .animPreview`);
                                                for (i = 0; i < sections.length; i++) sections[i].classList.remove('enabled');
                                                e.currentTarget.classList.add('enabled');
                                            }
                                        },
                                            [
                                                React.createElement('div',
                                                    {
                                                        class: 'animPreviewTempsContainer'
                                                    },
                                                    tempBlocks
                                                ),

                                                React.createElement('div',
                                                    {
                                                        class: 'animPreviewLabel'
                                                    },
                                                    this.template.label
                                                )
                                            ]
                                        )
                                    }

                                }

                                if (value == template.value) openedPage = Math.ceil((index + 1) / previewsCountOnPage) - 1;

                                previews.push(
                                    React.createElement(Preview,
                                        {
                                            enabled: value == template.value,
                                            template: template,
                                            page: openedPage
                                        },
                                    )
                                )
                            })

                            class CircleButtonPage extends React.Component {

                                constructor(props) {
                                    super(props)
                                    this.index = props.index
                                    this.text = props.text
                                    this.enabled = props.enabled
                                    this.closest = props.closest
                                    this.selector = props.selector
                                    this.tabSelector = props.tabSelector
                                    this.onclick = props.onclick
                                }

                                render() {
                                    return React.createElement('div',
                                        {
                                            class: `animPageCircleButton ${AnimationsPlugin.modules.RoundButton} ${this.enabled ? 'enabled' : ''}`,
                                            'data-page': this.index,
                                            onClick: (e) => {
                                                var selectorNodes = e.currentTarget.closest(this.closest).querySelectorAll(this.selector);
                                                var dataPage = e.currentTarget.getAttribute('data-page');

                                                for (var containerElem of selectorNodes) containerElem.classList.remove('show');

                                                selectorNodes[dataPage].classList.add('show');

                                                var sections = document.querySelectorAll(`[data-type="${options.type}"] ${this.tabSelector} .animPageCircleButton`);
                                                for (i = 0; i < sections.length; i++) sections[i].classList.remove('enabled');

                                                e.currentTarget.classList.add('enabled');

                                                this.onclick?.(e)
                                            }
                                        },
                                        this.text
                                    )
                                }
                            }

                            class CircleButton extends React.Component {

                                constructor(props) {
                                    super(props)
                                    this.text = props.text
                                    this.enabled = props.enabled
                                    this.onclick = props.onclick
                                }

                                render() {
                                    return React.createElement('div',
                                        {
                                            class: `animPageCircleButton ${AnimationsPlugin.modules.CodeRedemptionRedirect} ${AnimationsPlugin.modules.Card} ${this.enabled ? 'enabled' : ''}`,
                                            onClick: (e) => {
                                                this.onclick?.(e)
                                            }
                                        },
                                        this.text
                                    )
                                }
                            }

                            for (containersCount = 0; containersCount + 1 <= Math.ceil(previewsTemp.length / previewsCountOnPage); containersCount++) {
                                swipeButtonsDefault.push(
                                    React.createElement(CircleButtonPage,
                                        {
                                            index: containersCount,
                                            text: containersCount + 1,
                                            enabled: openedPage == containersCount,

                                            closest: '.animPreviewsPanel',
                                            selector: '.animPreviewsContainer',
                                            tabSelector: '.default',
                                            onclick: (e) => {
                                                var dataPage = e.currentTarget.getAttribute('data-page');
                                                this.settings[options.class].page = Number(dataPage);
                                            }
                                        }
                                    )
                                );

                                var pages = [];

                                var i = 0;
                                while (i < previewsCountOnPage) {
                                    pages.push(previews[(containersCount) * previewsCountOnPage + i])
                                    i++
                                }

                                containers.push(
                                    React.createElement('div',
                                        {
                                            class: `animPreviewsContainer ${(options.custom) ? (!this.settings[options.class].custom.enabled && openedPage == containersCount ? 'show' : '') : (openedPage == containersCount ? 'show' : '')} ${previewsTemp.length < previewsCountOnPage + 1 ? 'compact' : ''}`,
                                        },
                                        pages
                                    )
                                );

                            }

                            if (options.custom) {

                                for (var i = 0; i < this.settings[options.class].custom.frames.length; i++) {
                                    textareas.push(
                                        TextareasPanel(
                                            {
                                                elementsPanel: {
                                                    containersTemp: [
                                                        {
                                                            elements: [
                                                                {
                                                                    component: 'button',
                                                                    color: 'grey',
                                                                    label: TEMPS.LABELS.PREVIEW_BUTTON_TEMPLATE,
                                                                    disabled: this.eqObjects({ start: options.custom.data.frames[i].start, anim: options.custom.data.frames[i].anim }, this.defaultFrames.template),
                                                                    onclick: (e) => {
                                                                        var textareaStart = e.currentTarget.closest('.animTextareasPanel').querySelector('.animTextarea.start')
                                                                        var textareaAnim = e.currentTarget.closest('.animTextareasPanel').querySelector('.animTextarea.anim')

                                                                        textareaStart.value = this.defaultFrames.template.start;
                                                                        textareaAnim.value = this.defaultFrames.template.anim;
                                                                    }
                                                                },
                                                                {
                                                                    component: 'button',
                                                                    color: 'grey',
                                                                    label: TEMPS.LABELS.PREVIEW_BUTTON_CLEAR,
                                                                    disabled: this.eqObjects({ start: options.custom.data.frames[i].start, anim: options.custom.data.frames[i].anim }, this.defaultFrames.clear),
                                                                    onclick: (e) => {
                                                                        var textareaStart = e.currentTarget.closest('.animTextareasPanel').querySelector('.animTextarea.start')
                                                                        var textareaAnim = e.currentTarget.closest('.animTextareasPanel').querySelector('.animTextarea.anim')

                                                                        textareaStart.value = '';
                                                                        textareaAnim.value = '';
                                                                    }
                                                                },
                                                                {
                                                                    component: 'button',
                                                                    color: 'blurple',
                                                                    label: TEMPS.LABELS.PREVIEW_BUTTON_LOAD,
                                                                    disabled: this.eqObjects(this.settings[options.class].custom.frames[this.settings[options.class].custom.page],
                                                                        { start: options.custom.data.frames[i].start, anim: options.custom.data.frames[i].anim }),
                                                                    onclick: (e) => {
                                                                        var textareaStart = e.currentTarget.closest('.animTextareasPanel').querySelector('.animTextarea.start')
                                                                        var textareaAnim = e.currentTarget.closest('.animTextareasPanel').querySelector('.animTextarea.anim')

                                                                        textareaStart.value = this.settings[options.class].custom.frames[this.settings[options.class].custom.page].start
                                                                        textareaAnim.value = this.settings[options.class].custom.frames[this.settings[options.class].custom.page].anim
                                                                    }
                                                                },
                                                                {
                                                                    component: 'button',
                                                                    color: 'blurple',
                                                                    label: TEMPS.LABELS.PREVIEW_BUTTON_SAVE,
                                                                    disabled: this.eqObjects(this.settings[options.class].custom.frames[this.settings[options.class].custom.page],
                                                                        { start: options.custom.data.frames[i].start, anim: options.custom.data.frames[i].anim }),
                                                                    onclick: (e) => {
                                                                        var textareaStart = e.currentTarget.closest('.animTextareasPanel').querySelector('.animTextarea.start')
                                                                        var textareaAnim = e.currentTarget.closest('.animTextareasPanel').querySelector('.animTextarea.anim')

                                                                        this.settings[options.class].custom.frames[this.settings[options.class].custom.page] =
                                                                        {
                                                                            start: textareaStart.value,
                                                                            anim: textareaAnim.value
                                                                        }

                                                                        PluginUtilities.saveSettings(this.getName(), this.settings);
                                                                        if (
                                                                            this.isValidCSS(this.settings[options.class].custom.frames[this.settings[options.class].custom.page].start) &&
                                                                            this.isValidKeyframe(this.settings[options.class].custom.frames[this.settings[options.class].custom.page].anim)
                                                                        ) this.resetAnimations();
                                                                    }
                                                                },
                                                            ]
                                                        }
                                                    ],
                                                    options: {
                                                        widthAll: '100%',
                                                        marginAll: '0 8px'
                                                    }
                                                },
                                                textareas: [
                                                    {
                                                        height: '72px',
                                                        class: 'start',
                                                        invalid: !('invalid keyframe', this.isValidCSS(options.custom.data.frames[i].start) || options.custom.data.frames[i].start == ""),
                                                        value: options.custom.data.frames[i].start,
                                                        placeholder: `transform: scale(0);`,
                                                        onchange: (e) => {

                                                            var textareaStart = e.currentTarget
                                                            var textareaAnim = e.currentTarget.closest('.animTextareasPanel').querySelector('.animTextarea.anim')

                                                            if (this.isValidCSS(textareaStart.value) || textareaStart.value == "") {
                                                                textareaStart.classList.add('valid');
                                                                textareaStart.classList.remove('invalid');
                                                            } else {
                                                                textareaStart.classList.add('invalid');
                                                                textareaStart.classList.remove('valid');
                                                            }

                                                            options.custom?.onchange?.(e)
                                                        }
                                                    },
                                                    {
                                                        height: '250px',
                                                        class: 'anim',
                                                        invalid: !(this.isValidKeyframe(options.custom.data.frames[i].anim) || options.custom.data.frames[i].anim == ""),
                                                        value: options.custom.data.frames[i].anim,
                                                        placeholder: `0% {\n\ttransform: translate(0, 100%);\n}\n\n100% {\n\ttransform: transform(0, 0) scale(1);\n}`,
                                                        onchange: (e) => {

                                                            var textareaStart = e.currentTarget.closest('.animTextareasPanel').querySelector('.animTextarea.start')
                                                            var textareaAnim = e.currentTarget

                                                            if (this.isValidKeyframe(textareaAnim.value) || textareaAnim.value == "") {
                                                                textareaAnim.classList.add('valid');
                                                                textareaAnim.classList.remove('invalid');
                                                            } else {
                                                                textareaAnim.classList.add('invalid');
                                                                textareaAnim.classList.remove('valid');
                                                            }

                                                            options.custom?.onchange?.(e)
                                                        }
                                                    }
                                                ],
                                                class: `${this.settings[options.class].custom.enabled && i == this.settings[options.class].custom.page ? 'show' : ''}`,
                                                onchange: (e) => {
                                                    var textareaStart = e.currentTarget.closest('.animTextareasPanel.show').querySelector('.animTextarea.start')
                                                    var textareaAnim = e.currentTarget.closest('.animTextareasPanel.show').querySelector('.animTextarea.anim')
                                                    this.defaultFrames.values = {
                                                        start: textareaStart.value,
                                                        anim: textareaAnim.value
                                                    }
                                                    var buttons = e.currentTarget.closest('.animTextareasPanel.show').querySelectorAll('.elementsContainer > .animButton')

                                                    buttons[0].classList.toggle('disabled', this.eqObjects(this.defaultFrames.values, this.defaultFrames.template))
                                                    buttons[1].classList.toggle('disabled', this.eqObjects(this.defaultFrames.values, this.defaultFrames.clear))
                                                    buttons[2].classList.toggle('disabled', this.eqObjects(this.settings[options.class].custom.frames[this.settings[options.class].custom.page], this.defaultFrames.values))
                                                    buttons[3].classList.toggle('disabled', this.eqObjects(this.settings[options.class].custom.frames[this.settings[options.class].custom.page], this.defaultFrames.values))
                                                },
                                                onclick: (e) => {
                                                    var textareaStart = e.currentTarget.closest('.animTextareasPanel.show').querySelector('.animTextarea.start')
                                                    var textareaAnim = e.currentTarget.closest('.animTextareasPanel.show').querySelector('.animTextarea.anim')
                                                    this.defaultFrames.values = {
                                                        start: textareaStart.value,
                                                        anim: textareaAnim.value
                                                    }
                                                    var buttons = e.currentTarget.closest('.animTextareasPanel.show').querySelectorAll('.elementsContainer > .animButton')

                                                    buttons[0].classList.toggle('disabled', this.eqObjects(this.defaultFrames.values, this.defaultFrames.template))
                                                    buttons[1].classList.toggle('disabled', this.eqObjects(this.defaultFrames.values, this.defaultFrames.clear))
                                                    buttons[2].classList.toggle('disabled', this.eqObjects(this.settings[options.class].custom.frames[this.settings[options.class].custom.page], this.defaultFrames.values))
                                                    buttons[3].classList.toggle('disabled', this.eqObjects(this.settings[options.class].custom.frames[this.settings[options.class].custom.page], this.defaultFrames.values))
                                                }
                                            },
                                        ).render
                                    );

                                    swipeButtonsCustom.push(
                                        React.createElement(CircleButtonPage,
                                            {
                                                index: i,
                                                text: i + 1,
                                                enabled: this.settings[options.class].custom.page == i,

                                                closest: '.animPreviewsPanel',
                                                selector: '.animTextareasPanel',
                                                tabSelector: '.custom',
                                                onclick: (e) => {
                                                    var dataPage = e.currentTarget.getAttribute('data-page');
                                                    this.settings[options.class].custom.page = Number(dataPage);
                                                }
                                            }
                                        )
                                    );
                                }

                            }

                            class ActionButton extends React.Component {

                                constructor(props) {
                                    super(props)
                                    this.isEditing = props.isEditing
                                    this.onclick = props.onclick
                                }

                                render() {
                                    return React.createElement('div',
                                        {
                                            class: `animPreviewActionButton ${AnimationsPlugin.modules.CodeRedemptionRedirect} ${AnimationsPlugin.modules.Card} ${this.isEditing ? 'editing' : 'selecting'}`,
                                            onClick: this.onclick
                                        },

                                        React.createElement('div',
                                            {
                                                class: `switchActionButton`
                                            },
                                            [
                                                React.createElement('div', {
                                                    class: 'switchActionButtonLabel'
                                                },
                                                    TEMPS.LABELS.PREVIEW_SELECTING
                                                ),
                                                React.createElement("svg", {
                                                    width: "24",
                                                    height: "24",
                                                    viewBox: "3 2 19 19"
                                                },
                                                    React.createElement("path", {
                                                        style: { fill: "none" },
                                                        d: "M0 0h24v24H0z"
                                                    }),
                                                    React.createElement("path", {
                                                        d: options.horizontal ? "M 4 18 h 17 v -3 H 4 v 3 z M 4 10 v 3 h 17 v -3 h -17 M 4 5 v 3 h 17 V 5 H 4 z" : "M4 11h5V5H4v6zm0 7h5v-6H4v6zm6 0h5v-6h-5v6zm6 0h5v-6h-5v6zm-6-7h5V5h-5v6zm6-6v6h5V5h-5z"
                                                    })
                                                )
                                            ]
                                        ),
                                        React.createElement('div',
                                            {
                                                class: `switchActionButton`
                                            },
                                            [
                                                React.createElement('div', {
                                                    class: 'switchActionButtonLabel'
                                                },
                                                    TEMPS.LABELS.PREVIEW_EDITING
                                                ),
                                                React.createElement("svg", {
                                                    width: "24",
                                                    height: "24",
                                                    viewBox: "0 1 22 22"
                                                },
                                                    React.createElement("path", {
                                                        d: "M19.2929 9.8299L19.9409 9.18278C21.353 7.77064 21.353 5.47197 19.9409 4.05892C18.5287 2.64678 16.2292 2.64678 14.817 4.05892L14.1699 4.70694L19.2929 9.8299ZM12.8962 5.97688L5.18469 13.6906L10.3085 18.813L18.0201 11.0992L12.8962 5.97688ZM4.11851 20.9704L8.75906 19.8112L4.18692 15.239L3.02678 19.8796C2.95028 20.1856 3.04028 20.5105 3.26349 20.7337C3.48669 20.9569 3.8116 21.046 4.11851 20.9704Z",
                                                    })
                                                )
                                            ]
                                        )
                                    )
                                }

                            }

                            var result = React.createElement('div',
                                {
                                    class: `animPreviewsPanel ${options.horizontal ? 'horizontal' : 'vertical'}`,
                                    'data-type': options.type
                                },
                                [
                                    options.custom ? React.createElement('div',
                                        {
                                            class: 'animPreviewsActions'
                                        },
                                        React.createElement(ActionButton, {
                                            isEditing: this.settings[options.class].custom.enabled,
                                            onclick: async (e) => {

                                                this.settings[options.class].custom.enabled = !this.settings[options.class].custom.enabled;
                                                PluginUtilities.saveSettings(this.getName(), this.settings);
                                                if (
                                                    this.isValidCSS(this.settings[options.class].custom.frames[this.settings[options.class].custom.page].start) &&
                                                    this.isValidKeyframe(this.settings[options.class].custom.frames[this.settings[options.class].custom.page].anim)
                                                ) this.resetAnimations();

                                                var switcher = e.currentTarget;
                                                var panel = switcher.closest('.animPreviewsPanel');
                                                var all = panel.querySelectorAll(`.animPreviewsContainer, .animTextareasPanel`);
                                                all.forEach(elem => elem.classList.remove('show'));

                                                if (this.settings[options.class].custom.enabled) {
                                                    switcher.classList.add('editing')
                                                    switcher.classList.remove('selecting')
                                                    if (this.settings[options.class].custom.page >= 0) panel.getElementsByClassName(`animTextareasPanel`)[this.settings[options.class].custom.page].classList.add('show');
                                                    panel.getElementsByClassName('animPageButtons default')[0].classList.remove('show');
                                                    panel.getElementsByClassName('animPageButtons custom')[0].classList.add('show');
                                                } else {
                                                    switcher.classList.remove('editing')
                                                    switcher.classList.add('selecting')
                                                    if (this.settings[options.class].page >= 0) panel.getElementsByClassName(`animPreviewsContainer`)[this.settings[options.class].page].classList.add('show');
                                                    panel.getElementsByClassName('animPageButtons default')[0].classList.add('show');
                                                    panel.getElementsByClassName('animPageButtons custom')[0].classList.remove('show');
                                                }

                                            }
                                        })
                                    ) : null,
                                    ...containers,
                                    ...textareas,
                                    containers.length > 1 ?
                                        React.createElement('div',
                                            {
                                                class: `animPageButtons default ${options.custom ? (!this.settings[options.class].custom.enabled ? 'show' : '') : 'show'}`,
                                            },
                                            swipeButtonsDefault
                                        ) : null,
                                    React.createElement('div',
                                        {
                                            class: `animPageButtons custom ${options.custom ? (this.settings[options.class].custom.enabled ? 'show' : '') : 'show'}`,
                                        },
                                        swipeButtonsCustom
                                    ),
                                ]
                            )


                            class Panel extends React.Component {
                                render() {
                                    return result
                                }
                            }

                            return { class: Panel, render: result };
                        }

                        /**
                         * any
                         */

                        var TabsPanel = (tabsTemp = [], options = {}) => {

                            var tabsNodes = [];
                            var contentNodes = [];
                            var index = 0;

                            tabsTemp.forEach((tabTemp) => {

                                if (tabTemp?.component == 'divider') {
                                    tabsNodes.push(React.createElement('div', { class: `animTabDivider` }))
                                    return;
                                }

                                tabsNodes.push(
                                    React.createElement('div',
                                        {
                                            'data-index': index,
                                            class: `animTab ${tabTemp.disabled ? 'disabled' : ''}`,
                                            onClick: (e) => {
                                                if (tabTemp.disabled) return;
                                                var tab = e.currentTarget;
                                                var index = Number(tab.getAttribute('data-index'));
                                                var panel = tab.closest('.animTabsPanel');

                                                panel.querySelectorAll(`.animTab:not([data-index="${index}"])`).forEach(
                                                    (content) => {
                                                        content.classList.remove('selected')
                                                    }
                                                );
                                                panel.querySelectorAll(`.animContent:not([data-index="${index}"])`).forEach(
                                                    (content) => {
                                                        content.classList.remove('show')
                                                    }
                                                );
                                                panel.querySelector(`.animTab[data-index="${index}"]`).classList.toggle('selected')
                                                panel.querySelector(`.animContent[data-index="${index}"]`).classList.toggle('show')
                                            }
                                        },
                                        tabTemp.name
                                    )
                                )

                                contentNodes.push(
                                    React.createElement('div',
                                        {
                                            'data-index': index,
                                            class: `animContent`
                                        },
                                        Array.isArray(tabTemp.content) ? tabTemp.content : []
                                    )
                                )

                                index++
                            })

                            var result = React.createElement('div', {
                                style: {
                                    margin: options.margin ?? null,
                                    padding: options.padding ?? null
                                },
                                class: `animTabsPanel ${options.class ?? ''}`
                            },
                                [
                                    React.createElement('div',
                                        {
                                            class: 'animTabsContainer'
                                        },
                                        tabsNodes
                                    ),

                                    React.createElement('div',
                                        {
                                            class: 'animContentsContainer'
                                        },
                                        contentNodes
                                    ),
                                ]
                            )

                            class Panel extends React.Component {
                                render() {
                                    return result
                                }
                            }

                            return { class: Panel, render: result }
                        }

                        /**
                         * SettingsField.
                         */

                        var Field = (title, note, content) => {

                            var result = React.createElement('div',
                                {
                                    class: 'animField'
                                },
                                [
                                    React.createElement('div', { class: 'animFieldDivider' }),
                                    React.createElement('div', { class: 'animFieldTitle' }, title),
                                    React.createElement('div', { class: 'animFieldNote' }, note),
                                    React.createElement('div', { class: 'animFieldContent' }, content)
                                ]
                            )

                            class Field extends React.Component {
                                render() {
                                    return result
                                }
                            }

                            return { class: Field, render: result }
                        }

                        let Textcolors = {
                            red: '#ed4245',
                            green: '#3ba55d',
                            yellow: '#faa81a',
                            gray: '#36393f'
                        }

                        let SvgTemps = {
                            switcherTick: {
                                paths: [
                                    'M7.89561 14.8538L6.30462 13.2629L14.3099 5.25755L15.9009 6.84854L7.89561 14.8538Z',
                                    'M4.08643 11.0903L5.67742 9.49929L9.4485 13.2704L7.85751 14.8614L4.08643 11.0903Z'
                                ],
                                viewBox: '0 0 20 20'
                            },
                            switcherCross: {
                                paths: [
                                    'M5.13231 6.72963L6.7233 5.13864L14.855 13.2704L13.264 14.8614L5.13231 6.72963Z',
                                    'M13.2704 5.13864L14.8614 6.72963L6.72963 14.8614L5.13864 13.2704L13.2704 5.13864Z'
                                ],
                                viewBox: '0 0 20 20'
                            },
                            checked: {
                                paths: [
                                    'M5.37499 3H18.625C19.9197 3 21.0056 4.08803 21 5.375V18.625C21 19.936 19.9359 21 18.625 21H5.37499C4.06518 21 3 19.936 3 18.625V5.375C3 4.06519 4.06518 3 5.37499 3Z M9.58473 14.8636L6.04944 11.4051L4.50003 12.9978L9.58473 18L19.5 8.26174L17.9656 6.64795L9.58473 14.8636Z',
                                ],
                                viewBox: '0 0 24 24'
                            },
                            unchecked: {
                                paths: [
                                    'M5.37499 3H18.625C19.9197 3 21.0056 4.08803 21 5.375V18.625C21 19.936 19.9359 21 18.625 21H5.37499C4.06518 21 3 19.936 3 18.625V5.375C3 4.06519 4.06518 3 5.37499 3Z M 19 19 V 5 H 5 V 19 H 19 Z',
                                ],
                                viewBox: '0 0 24 24'
                            },
                            radioChecked: {
                                paths: [
                                    { fill: '#fff', 'fill-rule': 'evenodd', 'clip-rule': 'evenodd', d: 'M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z' },
                                    { tag: 'circle', cx: '12', cy: '12', r: '5' },
                                ],
                                viewBox: '0 0 24 24'
                            },
                            radioUnchecked: {
                                paths: [
                                    { 'fill-rule': 'evenodd', 'clip-rule': 'evenodd', d: 'M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z' },
                                ],
                                viewBox: '0 0 24 24'
                            },
                            searchLoupe: {
                                paths: [
                                    'M21.707 20.293L16.314 14.9C17.403 13.504 18 11.799 18 10C18 7.863 17.167 5.854 15.656 4.344C14.146 2.832 12.137 2 10 2C7.863 2 5.854 2.832 4.344 4.344C2.833 5.854 2 7.863 2 10C2 12.137 2.833 14.146 4.344 15.656C5.854 17.168 7.863 18 10 18C11.799 18 13.504 17.404 14.9 16.314L20.293 21.706L21.707 20.293ZM10 16C8.397 16 6.891 15.376 5.758 14.243C4.624 13.11 4 11.603 4 10C4 8.398 4.624 6.891 5.758 5.758C6.891 4.624 8.397 4 10 4C11.603 4 13.109 4.624 14.242 5.758C15.376 6.891 16 8.398 16 10C16 11.603 15.376 13.11 14.242 14.243C13.109 15.376 11.603 16 10 16Z',
                                ],
                                viewBox: '0 0 24 24'
                            },
                            searchCross: {
                                paths: [
                                    'M18.4 4L12 10.4L5.6 4L4 5.6L10.4 12L4 18.4L5.6 20L12 13.6L18.4 20L20 18.4L13.6 12L20 5.6L18.4 4Z'
                                ],
                                viewBox: '0 0 24 24'
                            },
                            gear: {
                                paths: [
                                    'M19.738 10H22V14H19.739C19.498 14.931 19.1 15.798 18.565 16.564L20 18L18 20L16.565 18.564C15.797 19.099 14.932 19.498 14 19.738V22H10V19.738C9.069 19.498 8.203 19.099 7.436 18.564L6 20L4 18L5.436 16.564C4.901 15.799 4.502 14.932 4.262 14H2V10H4.262C4.502 9.068 4.9 8.202 5.436 7.436L4 6L6 4L7.436 5.436C8.202 4.9 9.068 4.502 10 4.262V2H14V4.261C14.932 4.502 15.797 4.9 16.565 5.435L18 3.999L20 5.999L18.564 7.436C19.099 8.202 19.498 9.069 19.738 10ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z',
                                ],
                                viewBox: '0 0 24 24'
                            },
                            pencil: {
                                paths: [
                                    "M19.2929 9.8299L19.9409 9.18278C21.353 7.77064 21.353 5.47197 19.9409 4.05892C18.5287 2.64678 16.2292 2.64678 14.817 4.05892L14.1699 4.70694L19.2929 9.8299ZM12.8962 5.97688L5.18469 13.6906L10.3085 18.813L18.0201 11.0992L12.8962 5.97688ZM4.11851 20.9704L8.75906 19.8112L4.18692 15.239L3.02678 19.8796C2.95028 20.1856 3.04028 20.5105 3.26349 20.7337C3.48669 20.9569 3.8116 21.046 4.11851 20.9704Z",
                                ],
                                viewBox: '0 1 22 22'
                            },
                            closeCross: {
                                paths: [
                                    "M18.4 4L12 10.4L5.6 4L4 5.6L10.4 12L4 18.4L5.6 20L12 13.6L18.4 20L20 18.4L13.6 12L20 5.6L18.4 4Z",
                                ],
                                viewBox: '3 2 19 19'
                            },
                            info: {
                                paths: [
                                    "M6 1C3.243 1 1 3.244 1 6c0 2.758 2.243 5 5 5s5-2.242 5-5c0-2.756-2.243-5-5-5zm0 2.376a.625.625 0 110 1.25.625.625 0 010-1.25zM7.5 8.5h-3v-1h1V6H5V5h1a.5.5 0 01.5.5v2h1v1z",
                                ],
                                viewBox: '0 0 12 12'
                            },
                            help: {
                                paths: [
                                    "M12 2C6.486 2 2 6.487 2 12C2 17.515 6.486 22 12 22C17.514 22 22 17.515 22 12C22 6.487 17.514 2 12 2ZM12 18.25C11.31 18.25 10.75 17.691 10.75 17C10.75 16.31 11.31 15.75 12 15.75C12.69 15.75 13.25 16.31 13.25 17C13.25 17.691 12.69 18.25 12 18.25ZM13 13.875V15H11V12H12C13.104 12 14 11.103 14 10C14 8.896 13.104 8 12 8C10.896 8 10 8.896 10 10H8C8 7.795 9.795 6 12 6C14.205 6 16 7.795 16 10C16 11.861 14.723 13.429 13 13.875Z"
                                ],
                                viewBox: '0 0 24 24'
                            },
                            warn: {
                                paths: [
                                    "M10 0C4.486 0 0 4.486 0 10C0 15.515 4.486 20 10 20C15.514 20 20 15.515 20 10C20 4.486 15.514 0 10 0ZM9 4H11V11H9V4ZM10 15.25C9.31 15.25 8.75 14.691 8.75 14C8.75 13.31 9.31 12.75 10 12.75C10.69 12.75 11.25 13.31 11.25 14C11.25 14.691 10.69 15.25 10 15.25Z",
                                ],
                                viewBox: '-2 -2 24 24'
                            },
                            downloadArrow: {
                                paths: [
                                    'M16.293 9.293L17.707 10.707L12 16.414L6.29297 10.707L7.70697 9.293L11 12.586V2H13V12.586L16.293 9.293ZM18 20V18H20V20C20 21.102 19.104 22 18 22H6C4.896 22 4 21.102 4 20V18H6V20H18Z',
                                ],
                                viewBox: '-1 -1 26 26'
                            },
                            linkArrow: {
                                paths: [
                                    'M10 5V3H5.375C4.06519 3 3 4.06519 3 5.375V18.625C3 19.936 4.06519 21 5.375 21H18.625C19.936 21 21 19.936 21 18.625V14H19V19H5V5H10Z',
                                    'M21 2.99902H14V4.99902H17.586L9.29297 13.292L10.707 14.706L19 6.41302V9.99902H21V2.99902Z'
                                ],
                                viewBox: '0 0 24 24'
                            },
                            Logos: {
                                discord: {
                                    paths: [
                                        'M23.0212 1.67671C21.3107 0.879656 19.5079 0.318797 17.6584 0C17.4062 0.461742 17.1749 0.934541 16.9708 1.4184C15.003 1.12145 12.9974 1.12145 11.0283 1.4184C10.819 0.934541 10.589 0.461744 10.3368 0.00546311C8.48074 0.324393 6.67795 0.885118 4.96746 1.68231C1.56727 6.77853 0.649666 11.7538 1.11108 16.652C3.10102 18.1418 5.3262 19.2743 7.69177 20C8.22338 19.2743 8.69519 18.4993 9.09812 17.691C8.32996 17.3997 7.58522 17.0424 6.87684 16.6135C7.06531 16.4762 7.24726 16.3387 7.42403 16.1847C11.5911 18.1749 16.408 18.1749 20.5763 16.1847C20.7531 16.3332 20.9351 16.4762 21.1171 16.6135C20.41 17.0369 19.6639 17.3997 18.897 17.691C19.3052 '
                                        + '18.4993 19.7718 19.2689 20.3021 19.9945C22.6677 19.2689 24.8929 18.1364 26.8828 16.6466H26.8893C27.43 10.9731 25.9665 6.04728 23.0212 1.67671ZM9.68041 13.6383C8.39754 13.6383 7.34085 12.4453 7.34085 10.994C7.34085 9.54272 8.37155 8.34973 9.68041 8.34973C10.9893 8.34973 12.0395 9.54272 12.0187 10.994C12.0187 12.4453 10.9828 13.6383 9.68041 13.6383ZM18.3161 13.6383C17.0332 13.6383 15.9765 12.4453 15.9765 10.994C15.9765 9.54272 17.0124 8.34973 18.3161 8.34973C19.6184 8.34973 20.6751 9.54272 20.6543 10.994C20.6543 12.4453 19.6184 13.6383 18.3161 13.6383Z',
                                    ],
                                    viewBox: '0 -5 28 28'
                                },
                                betterdiscord: {
                                    paths: [
                                        'M1402.2,631.7c-9.7-353.4-286.2-496-642.6-496H68.4v714.1l442,398V490.7h257c274.5,0,274.5,344.9,0,344.9H597.6v329.5h169.8c274.5,0,274.5,344.8,0,344.8h-699v354.9h691.2c356.3,0,632.8-142.6,642.6-496c0-162.6-44.5-284.1-122.9-368.6C1357.7,915.8,1402.2,794.3,1402.2,631.7z',
                                        'M1262.5,135.2L1262.5,135.2l-76.8,0c26.6,13.3,51.7,28.1,75,44.3c70.7,49.1,126.1,111.5,164.6,185.3c39.9,76.6,61.5,165.6,64.3,264.6l0,1.2v1.2c0,141.1,0,596.1,0,737.1v1.2l0,1.2c-2.7,99-24.3,188-64.3,264.6c-38.5,73.8-93.8,136.2-164.6,185.3c-22.6,15.7-46.9,30.1-72.6,43.1h72.5c346.2,1.9,671-171.2,671-567.9V716.7C1933.5,312.2,1608.7,135.2,1262.5,135.2z',
                                    ],
                                    viewBox: '0 0 2000 2000'
                                },
                                github: {
                                    paths: [
                                        'm12 .5c-6.63 0-12 5.28-12 11.792 0 5.211 3.438 9.63 8.205 11.188.6.111.82-.254.82-.567 0-.28-.01-1.022-.015-2.005-3.338.711-4.042-1.582-4.042-1.582-.546-1.361-1.335-1.725-1.335-1.725-1.087-.731.084-.716.084-.716 1.205.082 1.838 1.215 1.838 1.215 1.07 1.803 2.809 1.282 3.495.981.108-.763.417-1.282.76-1.577-2.665-.295-5.466-1.309-5.466-5.827 0-1.287.465-2.339 1.235-3.164-.135-.298-.54-1.497.105-3.121 0 0 1.005-.316 3.3 1.209.96-.262 1.98-.392 3-.398 1.02.006 2.04.136 3 .398 2.28-1.525 3.285-1.209 '
                                        + '3.285-1.209.645 1.624.24 2.823.12 3.121.765.825 1.23 1.877 1.23 3.164 0 4.53-2.805 5.527-5.475 5.817.42.354.81 1.077.81 2.182 0 1.578-.015 2.846-.015 3.229 0 .309.21.678.825.56 4.801-1.548 8.236-5.97 8.236-11.173 0-6.512-5.373-11.792-12-11.792z',
                                    ],
                                    viewBox: '0 0 24 24'
                                },
                                patreon: {
                                    paths: [
                                        'm0 .5h4.219v23h-4.219z',
                                        'm15.384.5c-4.767 0-8.644 3.873-8.644 8.633 0 4.75 3.877 8.61 8.644 8.61 4.754 0 8.616-3.865 8.616-8.61 0-4.759-3.863-8.633-8.616-8.633z'
                                    ],
                                    viewBox: '0 0 24 24'
                                },
                            },
                            Other: {
                                list: {
                                    paths: [
                                        'M4 18h17v-6H4v6zM4 5v6h17V5H4z',
                                    ],
                                    viewBox: '3 2 19 19'
                                },
                                tile: {
                                    paths: [
                                        'M4 11h5V5H4v6zm0 7h5v-6H4v6zm6 0h5v-6h-5v6zm6 0h5v-6h-5v6zm-6-7h5V5h-5v6zm6-6v6h5V5h-5z',
                                    ],
                                    viewBox: '3 2 19 19'
                                },
                                puzzle: {
                                    paths: [
                                        'M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7 1.49 0 2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11z',
                                    ],
                                    viewBox: '0 0 24 24'
                                },
                                gear: {
                                    paths: [
                                        'M15.95 10.78c.03-.25.05-.51.05-.78s-.02-.53-.06-.78l1.69-1.32c.15-.12.19-.34.1-.51l-1.6-2.77c-.1-.18-.31-.24-.49-.18l-1.99.8c-.42-.32-.86-.58-1.35-.78L12 2.34c-.03-.2-.2-.34-.4-.34H8.4c-.2 0-.36.14-.39.34l-.3 2.12c-.49.2-.94.47-1.35.78l-1.99-.8c-.18-.07-.39 0-.49.18l-1.6 2.77c-.1.18-.06.39.1.51l1.69 1.32c-.04.25-.07.52-.07.78s.02.53.06.78L2.37 12.1c-.15.12-.19.34-.1.51l1.6 2.77c.1.18.31.24.49.18l1.99-.8c.42.32.86.58 1.35.78l.3 2.12c.04.2.2.34.4.34h3.2c.2 0 .37-.14.39-.34l.3-2.12c.49-.2.94-.47 1.35-.78l1.99.8c.18.07.39 0 .49-.18l1.6-2.77c.1-.18.06-.39-.1-.51l-1.67-1.32zM10 13c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z',
                                    ],
                                    viewBox: '1 1 18 18'
                                },
                                pencil: {
                                    paths: [
                                        'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z',
                                    ],
                                    viewBox: '0 0 24 24'
                                },
                                trash: {
                                    paths: [
                                        'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z'
                                    ],
                                    viewBox: '0 0 24 24'
                                },
                                web: {
                                    paths: [
                                        'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z'
                                    ],
                                    viewBox: '2 2 20 20'
                                },
                                help: {
                                    paths: [
                                        'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z',
                                    ],
                                    viewBox: '2 2 20 20'
                                },
                                donate: {
                                    paths: [
                                        'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z',
                                    ],
                                    viewBox: '2 2 20 20'
                                },
                                changelogArrow: {
                                    paths: [
                                        'M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z',
                                    ],
                                    viewBox: '0 0 24 24'
                                },
                                circleArrow: {
                                    paths: [
                                        'M 13 3 c -4.97 0 -9 4.03 -9 9 H 1 l 3.89 3.89 l 0.07 0.14 L 9 12 H 6 c 0 -3.87 3.13 -7 7 -7 s 7 3.13 7 7 s -3.13 7 -7 7 c -1.93 0 -3.68 -0.79 -4.94 -2.06 l -1.42 1.42 C 8.27 19.99 10.51 21 13 21 c 4.97 0 9 -4.03 9 -9 s -4.03 -9 -9 -9 z',
                                    ],
                                    viewBox: '0 0 24 24'
                                },
                                list2: {
                                    paths: [
                                        'M 4 18 h 17 v -3 H 4 v 3 z M 4 10 v 3 h 17 v -3 h -17 M 4 5 v 3 h 17 V 5 H 4 z',
                                    ],
                                    viewBox: '3 2 19 19'
                                },
                                eye: {
                                    paths: [
                                        'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z'
                                    ],
                                    viewBox: '0 0 24 24'
                                },
                            },
                        }

                        setTimeout(() => {
                            Tooltip.create(document.getElementById('animations-version-changelog'), TEMPS.TOOLTIPS.BUTTON_ANIMATIONS_VERSION_CHANGELOG)
                            Tooltip.create(document.getElementById('animations-version-check'), TEMPS.TOOLTIPS.BUTTON_ANIMATIONS_VERSION_CHECK)

                            Tooltip.create(document.getElementById('animations-reset'), TEMPS.TOOLTIPS.BUTTON_ANIMATIONS_RESET)
                            Tooltip.create(document.getElementById('animations-rebuild'), TEMPS.TOOLTIPS.BUTTON_ANIMATIONS_REBUILD)

                            Tooltip.create(document.getElementById('animations-issues'), TEMPS.TOOLTIPS.BUTTON_ANIMATIONS_ISSUES)
                            Tooltip.create(document.getElementById('animations-server'), TEMPS.TOOLTIPS.BUTTON_ANIMATIONS_SERVER)
                            Tooltip.create(document.getElementById('animations-discussions'), TEMPS.TOOLTIPS.BUTTON_ANIMATIONS_DISCUSSIONS)

                            Tooltip.create(document.getElementById('lists-switch-button'), TEMPS.TOOLTIPS.BUTTON_LISTS_SWITCH)
                            Tooltip.create(document.getElementById('buttons-switch-button'), TEMPS.TOOLTIPS.BUTTON_BUTTONS_SWITCH)
                            Tooltip.create(document.getElementById('messages-switch-button'), TEMPS.TOOLTIPS.BUTTON_MESSAGES_SWITCH)
                            Tooltip.create(document.getElementById('popouts-switch-button'), TEMPS.TOOLTIPS.BUTTON_POPOUTS_SWITCH)

                            Tooltip.create(document.getElementById('animations-reset-lists'), TEMPS.TOOLTIPS.BUTTON_RESET_LISTS)
                            Tooltip.create(document.getElementById('animations-reset-buttons'), TEMPS.TOOLTIPS.BUTTON_RESET_BUTTONS)
                            Tooltip.create(document.getElementById('animations-reset-messages'), TEMPS.TOOLTIPS.BUTTON_RESET_MESSAGES)
                            Tooltip.create(document.getElementById('animations-reset-popouts'), TEMPS.TOOLTIPS.BUTTON_RESET_POPOUTS)

                            Tooltip.create(document.getElementById('lists-selectors-default'), TEMPS.TOOLTIPS.BUTTON_SELECTORS_LISTS_DEFAULT)
                            Tooltip.create(document.getElementById('lists-selectors-clear'), TEMPS.TOOLTIPS.BUTTON_SELECTORS_LISTS_CLEAR)
                            Tooltip.create(document.getElementById('buttons-selectors-default'), TEMPS.TOOLTIPS.BUTTON_SELECTORS_BUTTONS_DEFAULT)
                            Tooltip.create(document.getElementById('buttons-selectors-clear'), TEMPS.TOOLTIPS.BUTTON_SELECTORS_BUTTONS_CLEAR)
                            Tooltip.create(document.getElementById('popouts-selectors-default'), TEMPS.TOOLTIPS.BUTTON_SELECTORS_POPOUTS_DEFAULT)
                            Tooltip.create(document.getElementById('popouts-selectors-clear'), TEMPS.TOOLTIPS.BUTTON_SELECTORS_POPOUTS_CLEAR)
                        }, 500)

                        var settings_panel =
                            Settings.SettingPanel.build(
                                this.saveSettings.bind(this),

                                new Settings.SettingField(null, null, null,
                                    ElementsPanel(
                                        [
                                            {
                                                elements: [
                                                    {
                                                        component: 'button',
                                                        color: 'blurple',
                                                        label: TEMPS.LABELS.BUTTON_ANIMATIONS_VERSION_CHANGELOG,
                                                        svgs: [SvgTemps.Other.changelogArrow],
                                                        id: 'animations-version-changelog',
                                                        inverted: false,
                                                        onclick: (e) => {
                                                            Modals.showChangelogModal(this.getName(), this.getVersion(), config.changelog)
                                                        }
                                                    },
                                                    {
                                                        component: 'button',
                                                        color: 'blurple',
                                                        label: TEMPS.LABELS.BUTTON_ANIMATIONS_VERSION_CHECK,
                                                        svgs: [SvgTemps.downloadArrow],
                                                        id: 'animations-version-check',
                                                        inverted: false,
                                                        onclick: async (e) => {
                                                            let button = e.currentTarget;

                                                            button.getElementsByTagName('span')[0].innerText = TEMPS.LABELS.BUTTON_ANIMATIONS_VERSION_CHECK_SEARCHING;
                                                            button.classList.remove('blurple', 'grey', 'red', 'yellow', 'green', 'white')
                                                            button.classList.add('blurple')

                                                            const request = this.requestGet('https://api.github.com/repos/Mopsgamer/BetterDiscord-codes/contents/plugins/Animations/Animations.plugin.js' + '?ref=main')
                                                            request.timeout = 5000;
                                                            request.timeout
                                                            request.ontimeout = function (e) {
                                                                button.getElementsByTagName('span')[0].innerText = TEMPS.LABELS.BUTTON_ANIMATIONS_VERSION_CHECK_TIMEOUT;
                                                                button.classList.remove('blurple', 'grey', 'red', 'yellow', 'green', 'white')
                                                                button.classList.add('red')
                                                            };

                                                            request.onreadystatechange = (e) => {
                                                                if (e.currentTarget.readyState != 4) return

                                                                var responseCode = JSON.parse(request?.responseText ?? undefined);
                                                                if (!request.responseText) {
                                                                    button.getElementsByTagName('span')[0].innerText = TEMPS.LABELS.BUTTON_ANIMATIONS_VERSION_CHECK_ERROR + " (try again later)";
                                                                    button.classList.remove('blurple', 'grey', 'red', 'yellow', 'green', 'white')
                                                                    button.classList.add('red')
                                                                    return
                                                                }
                                                                else if (responseCode?.message == 'Not Found') {
                                                                    button.getElementsByTagName('span')[0].innerText = TEMPS.LABELS.BUTTON_ANIMATIONS_VERSION_CHECK_ERROR + " (upd it yourself)";
                                                                    button.classList.remove('blurple', 'grey', 'red', 'yellow', 'green', 'white')
                                                                    button.classList.add('red')
                                                                    return
                                                                }

                                                                var GitHubFileText = this.fromBinary(responseCode.content);
                                                                var GitHubVersion = (/(\d+\.)*\d+/).exec((/^.*@version\s+(\d+\.)\d+.*$/m).exec(GitHubFileText))[0]

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

                                                                var UpdatePlugin = () => {
                                                                    this.closeSettings()
                                                                    return new Promise((rs, rj) => {
                                                                        try {
                                                                            let fs = require('fs')
                                                                            let path = require('path')
                                                                            fs.writeFile(path.join(BdApi.Plugins.folder, __filename), GitHubFileText, rs)
                                                                        } catch (err) {
                                                                            Logger.err(this.getName(), err)
                                                                        }
                                                                    })
                                                                }

                                                                switch (newerVersion(GitHubVersion, this.getVersion())) {
                                                                    case GitHubVersion:
                                                                        button.getElementsByTagName('span')[0].innerText = TEMPS.LABELS.BUTTON_ANIMATIONS_VERSION_CHECK_OLDER(GitHubVersion)
                                                                        button.classList.remove('blurple', 'grey', 'red', 'yellow', 'green', 'white')
                                                                        button.classList.add('green')
                                                                        button.addEventListener('click',
                                                                            () => {
                                                                                BdApi.showConfirmationModal(TEMPS.LABELS.BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_OLDER_TITLE,
                                                                                    [
                                                                                        TEMPS.LABELS.BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_OLDER_COMPARE(this.getVersion(), GitHubVersion),
                                                                                        React.createElement(
                                                                                            'span', { style: { color: Textcolors.green, 'text-transform': 'uppercase' } },
                                                                                            TEMPS.LABELS.BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_OLDER_NOTE
                                                                                        )
                                                                                    ],
                                                                                    {
                                                                                        onConfirm() {
                                                                                            UpdatePlugin()
                                                                                        }
                                                                                    })
                                                                            },
                                                                            { once: true }
                                                                        )
                                                                        break;
                                                                    case this.getVersion():
                                                                        button.getElementsByTagName('span')[0].innerText = TEMPS.LABELS.BUTTON_ANIMATIONS_VERSION_CHECK_NEWER(this.getVersion())
                                                                        button.classList.remove('blurple', 'grey', 'red', 'yellow', 'green', 'white')
                                                                        button.classList.add('grey')
                                                                        button.addEventListener('click',
                                                                            () => {
                                                                                BdApi.showConfirmationModal(TEMPS.LABELS.BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_NEWER_TITLE,
                                                                                    [
                                                                                        TEMPS.LABELS.BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_NEWER_COMPARE(this.getVersion(), GitHubVersion),
                                                                                        React.createElement(
                                                                                            'span', { style: { color: Textcolors.red, 'text-transform': 'uppercase' } },
                                                                                            TEMPS.LABELS.BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_NEWER_NOTE
                                                                                        )
                                                                                    ],
                                                                                    {
                                                                                        onConfirm() {
                                                                                            UpdatePlugin()
                                                                                        }
                                                                                    })
                                                                            },
                                                                            { once: true }
                                                                        )
                                                                        break;
                                                                    case false:
                                                                        button.getElementsByTagName('span')[0].innerText = TEMPS.LABELS.BUTTON_ANIMATIONS_VERSION_CHECK_LATEST(this.getVersion())
                                                                        button.classList.remove('blurple', 'grey', 'red', 'yellow', 'green', 'white')
                                                                        button.classList.add('grey')
                                                                        button.addEventListener('click',
                                                                            () => {
                                                                                BdApi.showConfirmationModal(TEMPS.LABELS.BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_LATEST_TITLE,
                                                                                    [
                                                                                        TEMPS.LABELS.BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_LATEST_COMPARE(this.getVersion(), GitHubVersion),
                                                                                        React.createElement(
                                                                                            'span', { style: { color: Textcolors.yellow, 'text-transform': 'uppercase' } },
                                                                                            TEMPS.LABELS.BUTTON_ANIMATIONS_VERSION_CHECK_CONFIRM_LATEST_NOTE
                                                                                        )
                                                                                    ],
                                                                                    {
                                                                                        onConfirm() {
                                                                                            UpdatePlugin()
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
                                                elements: [
                                                    {
                                                        component: 'button',
                                                        color: 'blurple',
                                                        label: TEMPS.LABELS.BUTTON_ANIMATIONS_RESET,
                                                        id: 'animations-reset',
                                                        svgs: [SvgTemps.gear],
                                                        onclick: async (e) => {

                                                            let button = e.currentTarget;
                                                            button.getElementsByTagName('span')[0].innerText = TEMPS.LABELS.BUTTON_ANIMATIONS_RESET_RESETING;
                                                            await this.wait(500);

                                                            PluginUtilities.saveSettings(this.getName(), this.defaultSettings);
                                                            this.settings = PluginUtilities.loadSettings(this.getName(), this.defaultSettings);
                                                            this.resetAnimations();
                                                            this.closeSettings();
                                                        }
                                                    },
                                                    {
                                                        component: 'button',
                                                        color: 'blurple',
                                                        label: TEMPS.LABELS.BUTTON_ANIMATIONS_REBUILD,
                                                        id: 'animations-rebuild',
                                                        svgs: [SvgTemps.Other.circleArrow],
                                                        onclick: () => this.resetAnimations(100)
                                                    }
                                                ],
                                            },
                                            {
                                                elements: [
                                                    { component: 'divider' },
                                                ]
                                            },
                                            {
                                                elements: [
                                                    {
                                                        component: 'button',
                                                        label: TEMPS.LABELS.BUTTON_ANIMATIONS_ISSUES,
                                                        color: 'grey',
                                                        id: 'animations-issues',
                                                        svgs: [SvgTemps.Logos.github],
                                                        link: 'https://github.com/Mopsgamer/BetterDiscord-codes/issues'
                                                    },
                                                    {
                                                        component: 'button',
                                                        label: TEMPS.LABELS.BUTTON_ANIMATIONS_DISCUSSIONS,
                                                        color: 'grey',
                                                        id: 'animations-discussions',
                                                        svgs: [SvgTemps.Logos.github],
                                                        link: 'https://github.com/Mopsgamer/BetterDiscord-codes/discussions'
                                                    },
                                                    {
                                                        component: 'button',
                                                        label: TEMPS.LABELS.BUTTON_ANIMATIONS_SERVER,
                                                        color: 'grey',
                                                        id: 'animations-server',
                                                        svgs: [SvgTemps.Logos.discord],
                                                        link: 'discord://discord.com/invite/PWtAHjBXtG',
                                                        onclick: () => { this.closeSettings() }
                                                    },
                                                ],
                                            },
                                        ],
                                        {
                                            widthAll: '100%',
                                            align: 'space-between'
                                        }).class
                                ),

                                new Settings.SettingField(null, null, null,

                                    TabsPanel(
                                        [
                                            {
                                                name: TEMPS.LABELS.GROUP_LISTS,
                                                content: [
                                                    Field(null, null,
                                                        ElementsPanel(
                                                            [
                                                                {
                                                                    elements: [
                                                                        {
                                                                            component: 'button',
                                                                            svgs: [this.settings.lists.enabled ? SvgTemps.checked : SvgTemps.unchecked],
                                                                            color: this.settings.lists.enabled ? 'green' : 'red',
                                                                            label: TEMPS.LABELS.BUTTON_LISTS_SWITCH,
                                                                            id: 'lists-switch-button',
                                                                            onclick: async (e) => {

                                                                                let button = e.currentTarget

                                                                                button.getElementsByTagName('span')[0].innerText = '...'

                                                                                this.settings.lists.enabled = !this.settings.lists.enabled;
                                                                                if (!this.settings.lists.enabled) {
                                                                                    button.classList.remove('green')
                                                                                    button.classList.add('red')
                                                                                    button.querySelector('path').setAttribute('d', SvgTemps.unchecked.paths)
                                                                                } else {
                                                                                    button.classList.remove('red')
                                                                                    button.classList.add('green')
                                                                                    button.querySelector('path').setAttribute('d', SvgTemps.checked.paths)
                                                                                }
                                                                                await this.resetAnimations();
                                                                                PluginUtilities.saveSettings(this.getName(), this.settings);
                                                                                button.getElementsByTagName('span')[0].innerText = TEMPS.LABELS.BUTTON_LISTS_SWITCH;
                                                                            }
                                                                        },
                                                                        {
                                                                            component: 'button',
                                                                            color: 'blurple',
                                                                            label: TEMPS.LABELS.BUTTON_RESET_LISTS,
                                                                            id: 'animations-reset-lists',
                                                                            svgs: [SvgTemps.Other.circleArrow],
                                                                            onclick: async (e) => {

                                                                                let button = e.currentTarget;
                                                                                button.getElementsByTagName('span')[0].innerText = TEMPS.LABELS.BUTTON_ANIMATIONS_RESET_RESETING;
                                                                                await this.wait(500);

                                                                                this.settings.lists = this.defaultSettings.lists
                                                                                PluginUtilities.saveSettings(this.getName(), this.settings);
                                                                                this.settings = PluginUtilities.loadSettings(this.getName(), this.defaultSettings);
                                                                                this.resetAnimations();
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
                                                        ).render
                                                    ).render,

                                                    Field(TEMPS.LABELS.FIELD_NAME, TEMPS.LABELS.FIELD_LISTS_NAME_NOTE(this.defaultSettings.lists.name),
                                                        PreviewsPanel(
                                                            [
                                                                { label: TEMPS.LABELS.PREVIEW_IN, value: 'in' },
                                                                { label: TEMPS.LABELS.PREVIEW_OUT, value: 'out' },
                                                                { label: TEMPS.LABELS.PREVIEW_CIRCLE, value: 'circle' },
                                                                { label: TEMPS.LABELS.PREVIEW_POLYGON, value: 'polygon' },
                                                                { label: TEMPS.LABELS.PREVIEW_OPACITY, value: 'opacity' },
                                                                { label: TEMPS.LABELS.PREVIEW_SLIME, value: 'slime' },
                                                                { label: TEMPS.LABELS.PREVIEW_BRICK_RIGHT, value: 'brick-right' },
                                                                { label: TEMPS.LABELS.PREVIEW_BRICK_LEFT, value: 'brick-left' },
                                                                { label: TEMPS.LABELS.PREVIEW_BRICK_UP, value: 'brick-up' },
                                                                { label: TEMPS.LABELS.PREVIEW_BRICK_DOWN, value: 'brick-down' },
                                                                { label: TEMPS.LABELS.PREVIEW_SLIDE_RIGHT, value: 'slide-right' },
                                                                { label: TEMPS.LABELS.PREVIEW_SLIDE_LEFT, value: 'slide-left' },
                                                                { label: TEMPS.LABELS.PREVIEW_SLIDE_UP, value: 'slide-up' },
                                                                { label: TEMPS.LABELS.PREVIEW_SLIDE_DOWN, value: 'slide-down' },
                                                                { label: TEMPS.LABELS.PREVIEW_SLIDE_UP_RIGHT, value: 'slide-up-right' },
                                                                { label: TEMPS.LABELS.PREVIEW_SLIDE_UP_LEFT, value: 'slide-up-left' },
                                                                { label: TEMPS.LABELS.PREVIEW_SLIDE_DOWN_RIGHT, value: 'slide-down-right' },
                                                                { label: TEMPS.LABELS.PREVIEW_SLIDE_DOWN_LEFT, value: 'slide-down-left' },
                                                                { label: TEMPS.LABELS.PREVIEW_SKEW_RIGHT, value: 'skew-right' },
                                                                { label: TEMPS.LABELS.PREVIEW_SKEW_LEFT, value: 'skew-left' },
                                                                { label: TEMPS.LABELS.PREVIEW_WIDE_SKEW_RIGHT, value: 'wide-skew-right' },
                                                                { label: TEMPS.LABELS.PREVIEW_WIDE_SKEW_LEFT, value: 'wide-skew-left' },
                                                            ],
                                                            {
                                                                type: 'lists-name',
                                                                class: 'lists',
                                                                custom: {
                                                                    data: this.settings.lists.custom,
                                                                }
                                                            },
                                                            this.settings.lists.name,
                                                            (e) => {
                                                                this.settings.lists.name = e.value;
                                                                this.settings.lists.page = e.page;
                                                                PluginUtilities.saveSettings(this.getName(), this.settings);
                                                                this.resetAnimations()
                                                            }).render
                                                    ).render,

                                                    Field(TEMPS.LABELS.FIELD_SEQUENCE, TEMPS.LABELS.FIELD_LISTS_SEQUENCE_NOTE(this.defaultSettings.lists.sequence),
                                                        PreviewsPanel(
                                                            [
                                                                { label: TEMPS.LABELS.PREVIEW_VERTICAL_FROM_FIRST, value: 'fromFirst' },
                                                                { label: TEMPS.LABELS.PREVIEW_VERTICAL_FROM_LAST, value: 'fromLast' },
                                                            ],
                                                            {
                                                                type: 'lists-sequence',
                                                                class: 'lists'
                                                            },
                                                            this.settings.lists.sequence,
                                                            (e) => {
                                                                this.settings.lists.sequence = e.value;
                                                                PluginUtilities.saveSettings(this.getName(), this.settings);
                                                                this.resetAnimations()
                                                            }
                                                        ).render
                                                    ).render,

                                                    Field(TEMPS.LABELS.FIELD_DELAY, TEMPS.LABELS.FIELD_LISTS_DELAY_NOTE(this.defaultSettings.lists.delay.toString().replace('.', ',')),
                                                        ElementsPanel(
                                                            [
                                                                {
                                                                    elements: [
                                                                        {
                                                                            component: 'input',
                                                                            value: this.settings.lists.delay,
                                                                            max: 0.35,
                                                                            step: 0.01,
                                                                            type: 'number',
                                                                            onchange: (e, v) => {
                                                                                this.settings.lists.delay = v;
                                                                                PluginUtilities.saveSettings(this.getName(), this.settings);
                                                                                this.resetAnimations()
                                                                            }
                                                                        },
                                                                        {
                                                                            component: 'button',
                                                                            padding: '6px',
                                                                            svgs: [{ ...SvgTemps.Other.circleArrow, width: '22px', height: '22px' }],
                                                                            onclick: (e) => {
                                                                                var button = e.currentTarget;
                                                                                var input = button.closest('.elementsContainer').querySelector('input');

                                                                                input.value = this.defaultSettings.lists.delay;
                                                                                this.settings.lists.delay = this.defaultSettings.lists.delay;
                                                                                PluginUtilities.saveSettings(this.getName(), this.settings);
                                                                                this.resetAnimations()
                                                                            }
                                                                        }
                                                                    ]
                                                                },
                                                            ]
                                                        ).render
                                                    ).render,

                                                    Field(TEMPS.LABELS.FIELD_DURATION, TEMPS.LABELS.FIELD_LISTS_DURATION_NOTE(this.defaultSettings.lists.duration.toString().replace('.', ',')),
                                                        ElementsPanel(
                                                            [
                                                                {
                                                                    elements: [
                                                                        {
                                                                            component: 'input',
                                                                            value: this.settings.lists.duration,
                                                                            max: 3,
                                                                            step: 0.1,
                                                                            type: 'number',
                                                                            onchange: (e, v) => {
                                                                                this.settings.lists.duration = v;
                                                                                PluginUtilities.saveSettings(this.getName(), this.settings);
                                                                                this.resetAnimations()
                                                                            }
                                                                        },
                                                                        {
                                                                            component: 'button',
                                                                            padding: '6px',
                                                                            svgs: [{ ...SvgTemps.Other.circleArrow, width: '22px', height: '22px' }],
                                                                            onclick: (e) => {
                                                                                var button = e.currentTarget;
                                                                                var input = button.closest('.elementsContainer').querySelector('input');

                                                                                input.value = this.defaultSettings.lists.duration;
                                                                                this.settings.lists.duration = this.defaultSettings.lists.duration;
                                                                                PluginUtilities.saveSettings(this.getName(), this.settings);
                                                                                this.resetAnimations()
                                                                            }
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        ).render
                                                    ).render,
                                                ]
                                            },
                                            {
                                                name: TEMPS.LABELS.GROUP_BUTTONS,
                                                content: [
                                                    Field(null, null,
                                                        ElementsPanel(
                                                            [
                                                                {
                                                                    elements: [
                                                                        {
                                                                            component: 'button',
                                                                            svgs: [this.settings.buttons.enabled ? SvgTemps.checked : SvgTemps.unchecked],
                                                                            color: this.settings.buttons.enabled ? 'green' : 'red',
                                                                            label: TEMPS.LABELS.BUTTON_BUTTONS_SWITCH,
                                                                            id: 'buttons-switch-button',
                                                                            onclick: async (e) => {

                                                                                let button = e.currentTarget

                                                                                button.getElementsByTagName('span')[0].innerText = '...'

                                                                                this.settings.buttons.enabled = !this.settings.buttons.enabled;
                                                                                if (!this.settings.buttons.enabled) {
                                                                                    button.classList.remove('green')
                                                                                    button.classList.add('red')
                                                                                    button.querySelector('path').setAttribute('d', SvgTemps.unchecked.paths)
                                                                                } else {
                                                                                    button.classList.remove('red')
                                                                                    button.classList.add('green')
                                                                                    button.querySelector('path').setAttribute('d', SvgTemps.checked.paths)
                                                                                }
                                                                                await this.resetAnimations();
                                                                                PluginUtilities.saveSettings(this.getName(), this.settings);
                                                                                button.getElementsByTagName('span')[0].innerText = TEMPS.LABELS.BUTTON_BUTTONS_SWITCH;
                                                                            }
                                                                        },
                                                                        {
                                                                            component: 'button',
                                                                            color: 'blurple',
                                                                            label: TEMPS.LABELS.BUTTON_RESET_BUTTONS,
                                                                            id: 'animations-reset-buttons',
                                                                            svgs: [SvgTemps.Other.circleArrow],
                                                                            onclick: async (e) => {

                                                                                let button = e.currentTarget;
                                                                                button.getElementsByTagName('span')[0].innerText = TEMPS.LABELS.BUTTON_ANIMATIONS_RESET_RESETING;
                                                                                await this.wait(500);

                                                                                this.settings.buttons = this.defaultSettings.buttons
                                                                                PluginUtilities.saveSettings(this.getName(), this.settings);
                                                                                this.settings = PluginUtilities.loadSettings(this.getName(), this.defaultSettings);
                                                                                this.resetAnimations();
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
                                                        ).render
                                                    ).render,

                                                    Field(TEMPS.LABELS.FIELD_NAME, TEMPS.LABELS.FIELD_BUTTONS_NAME_NOTE(this.defaultSettings.buttons.name),
                                                        PreviewsPanel(
                                                            [
                                                                { label: TEMPS.LABELS.PREVIEW_IN, value: 'in' },
                                                                { label: TEMPS.LABELS.PREVIEW_OUT, value: 'out' },
                                                                { label: TEMPS.LABELS.PREVIEW_CIRCLE, value: 'circle' },
                                                                { label: TEMPS.LABELS.PREVIEW_POLYGON, value: 'polygon' },
                                                                { label: TEMPS.LABELS.PREVIEW_OPACITY, value: 'opacity' },
                                                                { label: TEMPS.LABELS.PREVIEW_SLIME, value: 'slime' },
                                                                { label: TEMPS.LABELS.PREVIEW_BRICK_RIGHT, value: 'brick-right' },
                                                                { label: TEMPS.LABELS.PREVIEW_BRICK_LEFT, value: 'brick-left' },
                                                                { label: TEMPS.LABELS.PREVIEW_BRICK_UP, value: 'brick-up' },
                                                                { label: TEMPS.LABELS.PREVIEW_BRICK_DOWN, value: 'brick-down' },
                                                                { label: TEMPS.LABELS.PREVIEW_SLIDE_RIGHT, value: 'slide-right' },
                                                                { label: TEMPS.LABELS.PREVIEW_SLIDE_LEFT, value: 'slide-left' },
                                                                { label: TEMPS.LABELS.PREVIEW_SLIDE_UP, value: 'slide-up' },
                                                                { label: TEMPS.LABELS.PREVIEW_SLIDE_DOWN, value: 'slide-down' },
                                                                { label: TEMPS.LABELS.PREVIEW_SLIDE_UP_RIGHT, value: 'slide-up-right' },
                                                                { label: TEMPS.LABELS.PREVIEW_SLIDE_UP_LEFT, value: 'slide-up-left' },
                                                                { label: TEMPS.LABELS.PREVIEW_SLIDE_DOWN_RIGHT, value: 'slide-down-right' },
                                                                { label: TEMPS.LABELS.PREVIEW_SLIDE_DOWN_LEFT, value: 'slide-down-left' },
                                                                { label: TEMPS.LABELS.PREVIEW_SKEW_RIGHT, value: 'skew-right' },
                                                                { label: TEMPS.LABELS.PREVIEW_SKEW_LEFT, value: 'skew-left' },
                                                                { label: TEMPS.LABELS.PREVIEW_WIDE_SKEW_RIGHT, value: 'wide-skew-right' },
                                                                { label: TEMPS.LABELS.PREVIEW_WIDE_SKEW_LEFT, value: 'wide-skew-left' },
                                                            ],
                                                            {
                                                                type: 'buttons-name',
                                                                class: 'buttons',
                                                                horizontal: true,
                                                                custom: {
                                                                    data: this.settings.buttons.custom,
                                                                }
                                                            },
                                                            this.settings.buttons.name,
                                                            (e) => {
                                                                this.settings.buttons.name = e.value;
                                                                this.settings.buttons.page = e.page;
                                                                PluginUtilities.saveSettings(this.getName(), this.settings);
                                                                this.resetAnimations()
                                                            }
                                                        ).render
                                                    ).render,

                                                    Field(TEMPS.LABELS.FIELD_SEQUENCE, TEMPS.LABELS.FIELD_BUTTONS_SEQUENCE_NOTE(this.defaultSettings.buttons.sequence),
                                                        PreviewsPanel(
                                                            [
                                                                { label: TEMPS.LABELS.PREVIEW_HORIZONTAL_FROM_FIRST, value: 'fromFirst' },
                                                                { label: TEMPS.LABELS.PREVIEW_HORIZONTAL_FROM_LAST, value: 'fromLast' },
                                                            ],
                                                            {
                                                                horizontal: true,
                                                                type: 'buttons-sequence',
                                                                class: 'buttons'
                                                            },
                                                            this.settings.buttons.sequence,
                                                            (e) => {
                                                                this.settings.buttons.sequence = e.value;
                                                                PluginUtilities.saveSettings(this.getName(), this.settings);
                                                                this.resetAnimations()
                                                            }
                                                        ).render
                                                    ).render,

                                                    Field(TEMPS.LABELS.FIELD_DELAY, TEMPS.LABELS.FIELD_BUTTONS_DELAY_NOTE(this.defaultSettings.buttons.delay.toString().replace('.', ',')),
                                                        ElementsPanel(
                                                            [
                                                                {
                                                                    elements: [
                                                                        {
                                                                            component: 'input',
                                                                            value: this.settings.buttons.delay,
                                                                            max: 0.5,
                                                                            step: 0.01,
                                                                            type: 'number',
                                                                            onchange: (e, v) => {
                                                                                this.settings.buttons.delay = v;
                                                                                PluginUtilities.saveSettings(this.getName(), this.settings);
                                                                                this.resetAnimations()
                                                                            }
                                                                        },
                                                                        {
                                                                            component: 'button',
                                                                            padding: '6px',
                                                                            svgs: [{ ...SvgTemps.Other.circleArrow, width: '22px', height: '22px' }],
                                                                            onclick: (e) => {
                                                                                var button = e.currentTarget;
                                                                                var input = button.closest('.elementsContainer').querySelector('input');

                                                                                input.value = this.defaultSettings.buttons.delay;
                                                                                this.settings.buttons.delay = this.defaultSettings.buttons.delay;
                                                                                PluginUtilities.saveSettings(this.getName(), this.settings);
                                                                                this.resetAnimations()
                                                                            }
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        ).render
                                                    ).render,

                                                    Field(TEMPS.LABELS.FIELD_DURATION, TEMPS.LABELS.FIELD_BUTTONS_DURATION_NOTE(this.defaultSettings.buttons.duration.toString().replace('.', ',')),
                                                        ElementsPanel(
                                                            [
                                                                {
                                                                    elements: [
                                                                        {
                                                                            component: 'input',
                                                                            value: this.settings.buttons.duration,
                                                                            max: 3,
                                                                            step: 0.1,
                                                                            type: 'number',
                                                                            onchange: (e, v) => {
                                                                                this.settings.buttons.duration = v;
                                                                                PluginUtilities.saveSettings(this.getName(), this.settings);
                                                                                this.resetAnimations()
                                                                            }
                                                                        },
                                                                        {
                                                                            component: 'button',
                                                                            padding: '6px',
                                                                            svgs: [{ ...SvgTemps.Other.circleArrow, width: '22px', height: '22px' }],
                                                                            onclick: (e) => {
                                                                                var button = e.currentTarget;
                                                                                var input = button.closest('.elementsContainer').querySelector('input');

                                                                                input.value = this.defaultSettings.buttons.duration;
                                                                                this.settings.buttons.duration = this.defaultSettings.buttons.duration;
                                                                                PluginUtilities.saveSettings(this.getName(), this.settings);
                                                                                this.resetAnimations()
                                                                            }
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        ).render
                                                    ).render,
                                                ]
                                            },
                                            {
                                                name: TEMPS.LABELS.GROUP_MESSAGES,
                                                content: [
                                                    Field(null, null,
                                                        ElementsPanel(
                                                            [
                                                                {
                                                                    elements: [
                                                                        {
                                                                            component: 'button',
                                                                            svgs: [this.settings.messages.enabled ? SvgTemps.checked : SvgTemps.unchecked],
                                                                            color: this.settings.messages.enabled ? 'green' : 'red',
                                                                            label: TEMPS.LABELS.BUTTON_MESSAGES_SWITCH,
                                                                            id: 'messages-switch-button',
                                                                            onclick: async (e) => {

                                                                                let button = e.currentTarget

                                                                                button.getElementsByTagName('span')[0].innerText = '...'

                                                                                this.settings.messages.enabled = !this.settings.messages.enabled;
                                                                                if (!this.settings.messages.enabled) {
                                                                                    button.classList.remove('green')
                                                                                    button.classList.add('red')
                                                                                    button.querySelector('path').setAttribute('d', SvgTemps.unchecked.paths)
                                                                                } else {
                                                                                    button.classList.remove('red')
                                                                                    button.classList.add('green')
                                                                                    button.querySelector('path').setAttribute('d', SvgTemps.checked.paths)
                                                                                }
                                                                                await this.resetAnimations();
                                                                                PluginUtilities.saveSettings(this.getName(), this.settings);
                                                                                button.getElementsByTagName('span')[0].innerText = TEMPS.LABELS.BUTTON_MESSAGES_SWITCH;
                                                                            }
                                                                        },
                                                                        {
                                                                            component: 'button',
                                                                            color: 'blurple',
                                                                            label: TEMPS.LABELS.BUTTON_RESET_MESSAGES,
                                                                            id: 'animations-reset-messages',
                                                                            svgs: [SvgTemps.Other.circleArrow],
                                                                            onclick: async (e) => {

                                                                                let button = e.currentTarget;
                                                                                button.getElementsByTagName('span')[0].innerText = TEMPS.LABELS.BUTTON_ANIMATIONS_RESET_RESETING;
                                                                                await this.wait(500);

                                                                                this.settings.messages = this.defaultSettings.messages
                                                                                PluginUtilities.saveSettings(this.getName(), this.settings);
                                                                                this.settings = PluginUtilities.loadSettings(this.getName(), this.defaultSettings);
                                                                                this.resetAnimations();
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
                                                        ).render
                                                    ).render,

                                                    Field(TEMPS.LABELS.FIELD_NAME, TEMPS.LABELS.FIELD_MESSAGES_NAME_NOTE(this.defaultSettings.messages.name),
                                                        PreviewsPanel(
                                                            [
                                                                { label: TEMPS.LABELS.PREVIEW_IN, value: 'in' },
                                                                { label: TEMPS.LABELS.PREVIEW_OUT, value: 'out' },
                                                                { label: TEMPS.LABELS.PREVIEW_CIRCLE, value: 'circle' },
                                                                { label: TEMPS.LABELS.PREVIEW_POLYGON, value: 'polygon' },
                                                                { label: TEMPS.LABELS.PREVIEW_OPACITY, value: 'opacity' },
                                                                { label: TEMPS.LABELS.PREVIEW_SLIME, value: 'slime' },
                                                                { label: TEMPS.LABELS.PREVIEW_BRICK_RIGHT, value: 'brick-right' },
                                                                { label: TEMPS.LABELS.PREVIEW_BRICK_LEFT, value: 'brick-left' },
                                                                { label: TEMPS.LABELS.PREVIEW_BRICK_UP, value: 'brick-up' },
                                                                { label: TEMPS.LABELS.PREVIEW_BRICK_DOWN, value: 'brick-down' },
                                                                { label: TEMPS.LABELS.PREVIEW_SLIDE_RIGHT, value: 'slide-right' },
                                                                { label: TEMPS.LABELS.PREVIEW_SLIDE_LEFT, value: 'slide-left' },
                                                                { label: TEMPS.LABELS.PREVIEW_SLIDE_UP, value: 'slide-up' },
                                                                { label: TEMPS.LABELS.PREVIEW_SLIDE_DOWN, value: 'slide-down' },
                                                                { label: TEMPS.LABELS.PREVIEW_SLIDE_UP_RIGHT, value: 'slide-up-right' },
                                                                { label: TEMPS.LABELS.PREVIEW_SLIDE_UP_LEFT, value: 'slide-up-left' },
                                                                { label: TEMPS.LABELS.PREVIEW_SLIDE_DOWN_RIGHT, value: 'slide-down-right' },
                                                                { label: TEMPS.LABELS.PREVIEW_SLIDE_DOWN_LEFT, value: 'slide-down-left' },
                                                                { label: TEMPS.LABELS.PREVIEW_SKEW_RIGHT, value: 'skew-right' },
                                                                { label: TEMPS.LABELS.PREVIEW_SKEW_LEFT, value: 'skew-left' },
                                                                { label: TEMPS.LABELS.PREVIEW_WIDE_SKEW_RIGHT, value: 'wide-skew-right' },
                                                                { label: TEMPS.LABELS.PREVIEW_WIDE_SKEW_LEFT, value: 'wide-skew-left' },
                                                            ],
                                                            {
                                                                type: 'messages-name',
                                                                class: 'messages',
                                                                custom: {
                                                                    data: this.settings.messages.custom,
                                                                }
                                                            },
                                                            this.settings.messages.name,
                                                            (e) => {
                                                                this.settings.messages.name = e.value;
                                                                this.settings.messages.page = e.page;
                                                                PluginUtilities.saveSettings(this.getName(), this.settings);
                                                                this.resetAnimations()
                                                            }
                                                        ).render
                                                    ).render,

                                                    Field(TEMPS.LABELS.FIELD_DELAY, TEMPS.LABELS.FIELD_MESSAGES_DELAY_NOTE(this.defaultSettings.messages.delay.toString().replace('.', ',')),
                                                        ElementsPanel(
                                                            [
                                                                {
                                                                    elements: [
                                                                        {
                                                                            component: 'input',
                                                                            value: this.settings.messages.delay,
                                                                            max: 0.5,
                                                                            step: 0.01,
                                                                            type: 'number',
                                                                            onchange: (e, v) => {
                                                                                this.settings.messages.delay = v;
                                                                                PluginUtilities.saveSettings(this.getName(), this.settings);
                                                                                this.resetAnimations()
                                                                            }
                                                                        },
                                                                        {
                                                                            component: 'button',
                                                                            padding: '6px',
                                                                            svgs: [{ ...SvgTemps.Other.circleArrow, width: '22px', height: '22px' }],
                                                                            onclick: (e) => {
                                                                                var button = e.currentTarget;
                                                                                var input = button.closest('.elementsContainer').querySelector('input');

                                                                                input.value = this.defaultSettings.messages.delay;
                                                                                this.settings.messages.delay = this.defaultSettings.messages.delay;
                                                                                PluginUtilities.saveSettings(this.getName(), this.settings);
                                                                                this.resetAnimations()
                                                                            }
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        ).render
                                                    ).render,

                                                    Field(TEMPS.LABELS.FIELD_LIMIT, TEMPS.LABELS.FIELD_MESSAGES_LIMIT_NOTE(this.defaultSettings.messages.limit),
                                                        ElementsPanel(
                                                            [
                                                                {
                                                                    elements: [
                                                                        {
                                                                            component: 'input',
                                                                            value: this.settings.messages.limit,
                                                                            max: 100,
                                                                            step: 1,
                                                                            type: 'integer',
                                                                            onchange: (e, v) => {
                                                                                this.settings.messages.limit = v;
                                                                                PluginUtilities.saveSettings(this.getName(), this.settings);
                                                                                this.resetAnimations()
                                                                            }
                                                                        },
                                                                        {
                                                                            component: 'button',
                                                                            padding: '6px',
                                                                            svgs: [{ ...SvgTemps.Other.circleArrow, width: '22px', height: '22px' }],
                                                                            onclick: (e) => {
                                                                                var button = e.currentTarget;
                                                                                var input = button.closest('.elementsContainer').querySelector('input');

                                                                                input.value = this.defaultSettings.messages.limit;
                                                                                this.settings.messages.limit = this.defaultSettings.messages.limit;
                                                                                PluginUtilities.saveSettings(this.getName(), this.settings);
                                                                                this.resetAnimations()
                                                                            }
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        ).render
                                                    ).render,

                                                    Field(TEMPS.LABELS.FIELD_DURATION, TEMPS.LABELS.FIELD_MESSAGES_DURATION_NOTE(this.defaultSettings.messages.duration.toString().replace('.', ',')),
                                                        ElementsPanel(
                                                            [
                                                                {
                                                                    elements: [
                                                                        {
                                                                            component: 'input',
                                                                            value: this.settings.messages.duration,
                                                                            max: 3,
                                                                            step: 0.01,
                                                                            type: 'number',
                                                                            onchange: (e, v) => {
                                                                                this.settings.messages.duration = v;
                                                                                PluginUtilities.saveSettings(this.getName(), this.settings);
                                                                                this.resetAnimations()
                                                                            }
                                                                        },
                                                                        {
                                                                            component: 'button',
                                                                            padding: '6px',
                                                                            svgs: [{ ...SvgTemps.Other.circleArrow, width: '22px', height: '22px' }],
                                                                            onclick: (e) => {
                                                                                var button = e.currentTarget;
                                                                                var input = button.closest('.elementsContainer').querySelector('input');

                                                                                input.value = this.defaultSettings.messages.duration;
                                                                                this.settings.messages.duration = this.defaultSettings.messages.duration;
                                                                                PluginUtilities.saveSettings(this.getName(), this.settings);
                                                                                this.resetAnimations()
                                                                            }
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        ).render
                                                    ).render,
                                                ]
                                            },
                                            {
                                                name: TEMPS.LABELS.GROUP_POPOUTS,
                                                content: [
                                                    Field(null, null,
                                                        ElementsPanel(
                                                            [
                                                                {
                                                                    elements: [
                                                                        {
                                                                            component: 'button',
                                                                            svgs: [this.settings.popouts.enabled ? SvgTemps.checked : SvgTemps.unchecked],
                                                                            color: this.settings.popouts.enabled ? 'green' : 'red',
                                                                            label: TEMPS.LABELS.BUTTON_POPOUTS_SWITCH,
                                                                            id: 'popouts-switch-button',
                                                                            onclick: async (e) => {

                                                                                let button = e.currentTarget

                                                                                button.getElementsByTagName('span')[0].innerText = '...'

                                                                                this.settings.popouts.enabled = !this.settings.popouts.enabled;
                                                                                if (!this.settings.popouts.enabled) {
                                                                                    button.classList.remove('green')
                                                                                    button.classList.add('red')
                                                                                    button.querySelector('path').setAttribute('d', SvgTemps.unchecked.paths)
                                                                                } else {
                                                                                    button.classList.remove('red')
                                                                                    button.classList.add('green')
                                                                                    button.querySelector('path').setAttribute('d', SvgTemps.checked.paths)
                                                                                }
                                                                                await this.resetAnimations();
                                                                                PluginUtilities.saveSettings(this.getName(), this.settings);
                                                                                button.getElementsByTagName('span')[0].innerText = TEMPS.LABELS.BUTTON_POPOUTS_SWITCH;
                                                                            }
                                                                        },
                                                                        {
                                                                            component: 'button',
                                                                            color: 'blurple',
                                                                            label: TEMPS.LABELS.BUTTON_RESET_POPOUTS,
                                                                            id: 'animations-reset-popouts',
                                                                            svgs: [SvgTemps.Other.circleArrow],
                                                                            onclick: async (e) => {

                                                                                let button = e.currentTarget;
                                                                                button.getElementsByTagName('span')[0].innerText = TEMPS.LABELS.BUTTON_ANIMATIONS_RESET_RESETING;
                                                                                await this.wait(500);

                                                                                this.settings.popouts = this.defaultSettings.popouts
                                                                                PluginUtilities.saveSettings(this.getName(), this.settings);
                                                                                this.settings = PluginUtilities.loadSettings(this.getName(), this.defaultSettings);
                                                                                this.resetAnimations();
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
                                                        ).render
                                                    ).render,

                                                    Field(TEMPS.LABELS.FIELD_NAME, TEMPS.LABELS.FIELD_POPOUTS_NAME_NOTE(this.defaultSettings.popouts.name),
                                                        PreviewsPanel(
                                                            [
                                                                { label: TEMPS.LABELS.PREVIEW_IN, value: 'in' },
                                                                { label: TEMPS.LABELS.PREVIEW_OUT, value: 'out' },
                                                                { label: TEMPS.LABELS.PREVIEW_CIRCLE, value: 'circle' },
                                                                { label: TEMPS.LABELS.PREVIEW_POLYGON, value: 'polygon' },
                                                                { label: TEMPS.LABELS.PREVIEW_OPACITY, value: 'opacity' },
                                                                { label: TEMPS.LABELS.PREVIEW_SLIME, value: 'slime' },
                                                                { label: TEMPS.LABELS.PREVIEW_BRICK_RIGHT, value: 'brick-right' },
                                                                { label: TEMPS.LABELS.PREVIEW_BRICK_LEFT, value: 'brick-left' },
                                                                { label: TEMPS.LABELS.PREVIEW_BRICK_UP, value: 'brick-up' },
                                                                { label: TEMPS.LABELS.PREVIEW_BRICK_DOWN, value: 'brick-down' },
                                                                { label: TEMPS.LABELS.PREVIEW_SLIDE_RIGHT, value: 'slide-right' },
                                                                { label: TEMPS.LABELS.PREVIEW_SLIDE_LEFT, value: 'slide-left' },
                                                                { label: TEMPS.LABELS.PREVIEW_SLIDE_UP, value: 'slide-up' },
                                                                { label: TEMPS.LABELS.PREVIEW_SLIDE_DOWN, value: 'slide-down' },
                                                                { label: TEMPS.LABELS.PREVIEW_SLIDE_UP_RIGHT, value: 'slide-up-right' },
                                                                { label: TEMPS.LABELS.PREVIEW_SLIDE_UP_LEFT, value: 'slide-up-left' },
                                                                { label: TEMPS.LABELS.PREVIEW_SLIDE_DOWN_RIGHT, value: 'slide-down-right' },
                                                                { label: TEMPS.LABELS.PREVIEW_SLIDE_DOWN_LEFT, value: 'slide-down-left' },
                                                                { label: TEMPS.LABELS.PREVIEW_SKEW_RIGHT, value: 'skew-right' },
                                                                { label: TEMPS.LABELS.PREVIEW_SKEW_LEFT, value: 'skew-left' },
                                                                { label: TEMPS.LABELS.PREVIEW_WIDE_SKEW_RIGHT, value: 'wide-skew-right' },
                                                                { label: TEMPS.LABELS.PREVIEW_WIDE_SKEW_LEFT, value: 'wide-skew-left' },
                                                            ],
                                                            {
                                                                type: 'popouts-name',
                                                                class: 'popouts',
                                                                horizontal: false,
                                                                tempBlocks: {
                                                                    count: 1,
                                                                    height: '36%'
                                                                },
                                                                custom: {
                                                                    data: this.settings.popouts.custom,
                                                                }
                                                            },
                                                            this.settings.popouts.name,
                                                            (e) => {
                                                                this.settings.popouts.name = e.value;
                                                                this.settings.popouts.page = e.page;
                                                                PluginUtilities.saveSettings(this.getName(), this.settings);
                                                                this.resetAnimations()
                                                            }
                                                        ).render
                                                    ).render,

                                                    Field(TEMPS.LABELS.FIELD_DURATION, TEMPS.LABELS.FIELD_POPOUTS_DURATION_NOTE(this.defaultSettings.popouts.duration.toString().replace('.', ',')),
                                                        ElementsPanel(
                                                            [
                                                                {
                                                                    elements: [
                                                                        {
                                                                            component: 'input',
                                                                            value: this.settings.popouts.duration,
                                                                            max: 3,
                                                                            step: 0.01,
                                                                            type: 'number',
                                                                            onchange: (e, v) => {
                                                                                this.settings.popouts.duration = v;
                                                                                PluginUtilities.saveSettings(this.getName(), this.settings);
                                                                                this.resetAnimations()
                                                                            }
                                                                        },
                                                                        {
                                                                            component: 'button',
                                                                            padding: '6px',
                                                                            svgs: [{ ...SvgTemps.Other.circleArrow, width: '22px', height: '22px' }],
                                                                            onclick: (e) => {
                                                                                var button = e.currentTarget;
                                                                                var input = button.closest('.elementsContainer').querySelector('input');

                                                                                input.value = this.defaultSettings.popouts.duration;
                                                                                this.settings.popouts.duration = this.defaultSettings.popouts.duration;
                                                                                PluginUtilities.saveSettings(this.getName(), this.settings);
                                                                                this.resetAnimations()
                                                                            }
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        ).render
                                                    ).render,
                                                ]
                                            },
                                            { component: 'divider' },
                                            {
                                                name: TEMPS.LABELS.GROUP_ADVANCED,
                                                content: [
                                                    Field(TEMPS.LABELS.FIELD_LISTS_SELECTORS, TEMPS.LABELS.FIELD_LISTS_SELECTORS_NOTE,
                                                        TextareasPanel(
                                                            {
                                                                elementsPanel: {
                                                                    containersTemp: [
                                                                        {
                                                                            elements: [
                                                                                {
                                                                                    component: 'button',
                                                                                    label: TEMPS.LABELS.BUTTON_SELECTORS_LISTS_DEFAULT,
                                                                                    id: 'lists-selectors-default',
                                                                                    svgs: [SvgTemps.Other.circleArrow],
                                                                                    onclick: (e) => {
                                                                                        var textarea = e.currentTarget.closest('.animTextareasPanel').querySelector('.animTextarea')
                                                                                        textarea.value = AnimationsPlugin.selectorsLists.join(',\n\n')
                                                                                        textarea.style.color = '';

                                                                                        this.settings.lists.selectors = '';
                                                                                        PluginUtilities.saveSettings(this.getName(), this.settings);
                                                                                    }
                                                                                },
                                                                                {
                                                                                    component: 'button',
                                                                                    label: TEMPS.LABELS.BUTTON_SELECTORS_LISTS_CLEAR,
                                                                                    id: 'lists-selectors-clear',
                                                                                    onclick: (e) => {
                                                                                        var textarea = e.currentTarget.closest('.animTextareasPanel').querySelector('.animTextarea')
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
                                                                },
                                                                textareas: [
                                                                    {
                                                                        value: this.settings.lists.selectors ? this.settings.lists.selectors : AnimationsPlugin.selectorsLists.join(',\n\n')
                                                                    }
                                                                ],
                                                            },
                                                            (e) => {
                                                                var textarea = e.currentTarget;
                                                                var value = textarea.value;

                                                                if (value == '' || this.isValidSelector(value)) {
                                                                    this.settings.lists.selectors = (value == AnimationsPlugin.selectorsLists ? '' : value)
                                                                    PluginUtilities.saveSettings(this.getName(), this.settings);
                                                                    this.resetAnimations()
                                                                    textarea.style.color = ''
                                                                } else {
                                                                    textarea.style.color = Textcolors.red
                                                                }
                                                            }
                                                        ).render
                                                    ).render,

                                                    Field(TEMPS.LABELS.FIELD_BUTTONS_SELECTORS, TEMPS.LABELS.FIELD_BUTTONS_SELECTORS_NOTE,
                                                        TextareasPanel(
                                                            {
                                                                elementsPanel: {
                                                                    containersTemp: [
                                                                        {
                                                                            elements: [
                                                                                {
                                                                                    component: 'button',
                                                                                    label: TEMPS.LABELS.BUTTON_SELECTORS_BUTTONS_DEFAULT,
                                                                                    id: 'buttons-selectors-default',
                                                                                    svgs: [SvgTemps.Other.circleArrow],
                                                                                    onclick: (e) => {
                                                                                        var textarea = e.currentTarget.closest('.animTextareasPanel').querySelector('.animTextarea')
                                                                                        textarea.value = AnimationsPlugin.selectorsButtons.join(',\n\n')
                                                                                        textarea.style.color = '';

                                                                                        this.settings.lists.selectors = '';
                                                                                        PluginUtilities.saveSettings(this.getName(), this.settings);
                                                                                    }
                                                                                },
                                                                                {
                                                                                    component: 'button',
                                                                                    label: TEMPS.LABELS.BUTTON_SELECTORS_BUTTONS_CLEAR,
                                                                                    id: 'buttons-selectors-clear',
                                                                                    onclick: (e) => {
                                                                                        var textarea = e.currentTarget.closest('.animTextareasPanel').querySelector('.animTextarea')
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
                                                                },
                                                                textareas: [
                                                                    {
                                                                        value: this.settings.buttons.selectors ? this.settings.buttons.selectors : AnimationsPlugin.selectorsButtons.join(',\n\n')
                                                                    }
                                                                ],
                                                            },
                                                            (e) => {
                                                                var textarea = e.currentTarget;
                                                                var value = textarea.value;

                                                                if (value == '' || this.isValidSelector(value)) {
                                                                    this.settings.buttons.selectors = (value == AnimationsPlugin.selectorsButtons ? '' : value)
                                                                    PluginUtilities.saveSettings(this.getName(), this.settings);
                                                                    this.resetAnimations()
                                                                    textarea.style.color = ''
                                                                } else {
                                                                    textarea.style.color = Textcolors.red
                                                                }
                                                            }
                                                        ).render
                                                    ).render,

                                                    Field(TEMPS.LABELS.FIELD_POPOUTS_SELECTORS, TEMPS.LABELS.FIELD_POPOUTS_SELECTORS_NOTE,
                                                        TextareasPanel(
                                                            {
                                                                elementsPanel: {
                                                                    containersTemp: [
                                                                        {
                                                                            elements: [
                                                                                {
                                                                                    component: 'button',
                                                                                    label: TEMPS.LABELS.BUTTON_SELECTORS_POPOUTS_DEFAULT,
                                                                                    id: 'popouts-selectors-default',
                                                                                    svgs: [SvgTemps.Other.circleArrow],
                                                                                    onclick: (e) => {
                                                                                        var textarea = e.currentTarget.closest('.animTextareasPanel').querySelector('.animTextarea')
                                                                                        textarea.value = AnimationsPlugin.selectorsPopouts.join(',\n\n')
                                                                                        textarea.style.color = '';

                                                                                        this.settings.lists.selectors = '';
                                                                                        PluginUtilities.saveSettings(this.getName(), this.settings);
                                                                                    }
                                                                                },
                                                                                {
                                                                                    component: 'button',
                                                                                    label: TEMPS.LABELS.BUTTON_SELECTORS_POPOUTS_CLEAR,
                                                                                    id: 'popouts-selectors-clear',
                                                                                    onclick: (e) => {
                                                                                        var textarea = e.currentTarget.closest('.animTextareasPanel').querySelector('.animTextarea')
                                                                                        textarea.value = '';
                                                                                        textarea.focus();
                                                                                    }
                                                                                }
                                                                            ]
                                                                        }
                                                                    ],
                                                                    options: {
                                                                        widthAll: '100%'
                                                                    },
                                                                },
                                                                textareas: [
                                                                    {
                                                                        height: '92px',
                                                                        value: this.settings.popouts.selectors ? this.settings.popouts.selectors : AnimationsPlugin.selectorsPopouts.join(',\n\n')
                                                                    }
                                                                ],
                                                            },
                                                            (e) => {
                                                                var textarea = e.currentTarget;
                                                                var value = textarea.value;

                                                                if (value == '' || this.isValidSelector(value)) {
                                                                    this.settings.popouts.selectors = (value == AnimationsPlugin.selectorsPopouts ? '' : value)
                                                                    PluginUtilities.saveSettings(this.getName(), this.settings);
                                                                    this.resetAnimations()
                                                                    textarea.style.color = ''
                                                                } else {
                                                                    textarea.style.color = Textcolors.red
                                                                }
                                                            },
                                                        ).render
                                                    ).render,
                                                ]
                                            },
                                        ]
                                    ).class
                                ),
                            )

                        return settings_panel
                    }

                    start() {

                        PluginUpdater.checkForUpdate(this.getName(), this.getVersion(), "https://raw.githubusercontent.com/Mopsgamer/BetterDiscord-codes/main/plugins/Animations/Animations.plugin.js");

                        let Textcolors = {
                            red: '#ed4245',
                            green: '#3ba55d',
                            yellow: '#faa81a',
                            gray: '#36393f'
                        }

                        let componentsStyles = `/*components*/

                    .animField {
                        padding: 5px;
                    }

                    .animFieldDivider {
                        width: 100%;
                    }

                    .animFieldDivider:not(.animField:first-child > *) {
                        width: 100%;
                        height: 1px;
                        border-top: thin solid var(--background-modifier-accent);
                        margin: 20px 0;
                    }

                    .animFieldTitle {
                        color: var(--header-secondary);
                        margin-bottom: 8px;
                        font-size: 12px;
                        line-height: 16px;
                        font-weight: 600;
                        text-transform: uppercase;
                    }

                    .animFieldNote {
                        color: var(--header-secondary);
                        margin-bottom: 8px;
                        font-size: 14px;
                        line-height: 20px;
                        font-weight: 400;
                    }

                    .animContent {
                        height: 0;
                        width: 100%;
                        overflow: hidden;
                        opacity: 0;
                        transition: 0.5s opacity;
                    }

                    .animContent.show {
                        display: block;
                        height: fit-content;
                        margin-top: 20px;
                        opacity: 1;
                    }

                    .animTab {
                        display: inline-block;
                        box-sizing: border-box;
                        border-radius: 3px;
                        padding: 10px 10px;
                        margin: 6px 6px;
                        width: 100%;
                        color: var(--header-primary);
                        transition: 0.2s;
                        text-align: center;
                        font-family: Whitney, "Helvetica Neue", Helvetica, Arial, sans-serif;
                        font-size: 14px;
                    }

                    .animTab + .animTab {
                        margin-left: 0;
                    }

                    .animTab:hover:not(.selected):not(.disabled) {
                        box-shadow: inset 0 0 0 1px var(--brand-experiment);
                    }
                    .animTab.selected {
                        background-color: var(--brand-experiment);
                    }

                    .animTabDivider {
                        width: 0;
                        height: 25px;
                        margin: auto 0;
                        border-right: thin solid var(--background-accent);
                    }

                    .animTabsContainer {
                        border-radius: 3px;
                        background-color: var(--background-secondary-alt);
                        justify-content: space-between;
                        display: flex;
                        position: sticky;
                        z-index: 1;
                        top: 0;
                    }

                    .animContentsContainer .animTabsContainer {z-index: 0;}

                    .animPreviewsPanel {
                        overflow: hidden;
                    }

                    .animPreviewsContainer, .animPreviewsPanel .animTextareasPanel {
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

                    .animPreviewsPanel .animTextareasPanel {
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

                    .animTextarea.invalid {
                        color: ${Textcolors.red};
                    }

                    .animTextarea::placeholder {
                        font-family: Consolas, monopoly;
                    }

                    .animPreviewsContainer.show, .animPreviewsPanel .animTextareasPanel.show {
                        opacity: 1;
                        border: 1px solid var(--background-tertiary);
                        height: 420px;
                    }

                    .animPreviewsContainer.compact {
                        height: fit-content;
                        padding: 10px 0;
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
                        padding: 0;
                        color: var(--interactive-normal);
                        text-align: center;
                        text-transform: capitalize;
                        font-size: 18px;
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
                        line-height: 125%;
                        width: 180px;
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
                        text-align: center;
                    }

                    .animPageCircleButton:first-child {
                        margin: 5px 5px 5px auto;
                    }

                    .animPageCircleButton:last-child {
                        margin: 5px auto 5px 5px;
                    }

                    .animPageCircleButton.enabled {
                        background-color: var(--brand-experiment);
                    }

                    .animPreview {
                        margin: 0;
                        border: 1px solid;
                        border-radius: 3px;
                        overflow: hidden;
                    }

                    .vertical .animPreview {
                        display: inline-flex;
                        box-sizing: border-box;
                        width: 120px;
                        height: 185px;
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

                    .vertical .animPreviewTempsContainer {
                        display: flex;
                        width: 100%;
                        height: 100%;
                        flex-direction: column;
                        flex-wrap: nowrap;
                        justify-content: space-evenly;
                    }

                    .horizontal .animPreviewTempsContainer {
                        display: flex;
                        width: 100%;
                        height: 26px;
                        flex-direction: row;
                        flex-wrap: nowrap;
                        justify-content: space-between;
                    }
                    
                    .vertical .animPreview .animTempBlock {
                        border-radius: 3pt;
                        background-color: var(--interactive-normal)
                    }

                    .horizontal .animPreview .animTempBlock {
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
                        color: var(--interactive-normal);
                        font-size: 10pt;
                        margin: 4px;
                        padding: 0 4px;
                    }
                    
                    .vertical .animPreview .animPreviewLabel {
                        height: 58px;
                        width: auto;
                        bottom: 6pt;
                        line-height: 100%;
                        text-align: center;
                    }

                    .horizontal .animPreview .animPreviewLabel {
                        height: 26px;
                        width: 50%;
                        display: inline-block;
                        float: right;
                        line-height: 200%;
                        text-align: right;
                    }

                    .animPreview.enabled .animPreviewLabel {
                        color: #fff;
                        border-color: #fff;
                    }


                    .elementsContainer.nosidemargin > :first-child {
                        margin-left: 0 !important;
                    }
                    .elementsContainer.nosidemargin > :last-child {
                        margin-right: 0 !important;
                    }
                    
                    .animButton.blurple.filled {
                        color: white;
                        background-color: var(--brand-experiment);
                    }
                    .animButton.blurple.filled:hover:not(.disabled) {
                        background-color: var(--brand-experiment-560);
                    }
                    .animButton.blurple.inverted {
                        color: var(--brand-experiment);
                        border: 1px solid var(--brand-experiment);
                    }
                    .animButton.blurple.inverted:hover:not(.disabled) {
                        color: var(--brand-experiment-560);
                        border: 1px solid var(--brand-experiment-560);
                    }
                    
                    .animButton.white.filled {
                        color: var(--brand-experiment);
                        background-color: #fff;
                    }
                    .animButton.white.filled:hover:not(.disabled) {
                        background-color: var(--brand-experiment-100);
                    }
                    .animButton.white.inverted {
                        color: #fff;
                        border: 1px solid #fff;
                    }
                    .animButton.white.inverted:hover:not(.disabled) {
                        color: var(--brand-experiment-100);
                        border: 1px solid var(--brand-experiment-100);
                    }

                    .animButton.grey.filled {
                        color: white;
                        background-color: #4f545c;
                    }
                    .animButton.grey.filled:hover:not(.disabled) {
                        background-color: #5d6269;
                    }
                    .animButton.grey.inverted {
                        color: #4f545c;
                        border: 1px solid #4f545c;
                    }
                    .animButton.grey.inverted:hover:not(.disabled) {
                        color: #5d6269;
                        border: 1px solid #5d6269;
                    }

                    .animButton.red.filled {
                        color: white;
                        background-color: hsl(359,calc(var(--saturation-factor, 1)*82.6%),59.4%);
                    }
                    .animButton.red.filled:hover:not(.disabled) {
                        background-color: hsl(359,calc(var(--saturation-factor, 1)*56.7%),48%);
                    }
                    .animButton.red.inverted {
                        color: hsl(359,calc(var(--saturation-factor, 1)*82.6%),59.4%);
                        border: 1px solid hsl(359,calc(var(--saturation-factor, 1)*82.6%),59.4%);
                    }
                    .animButton.red.inverted:hover:not(.disabled) {
                        color: hsl(359,calc(var(--saturation-factor, 1)*56.7%),48%);
                        border: 1px solid hsl(359,calc(var(--saturation-factor, 1)*56.7%),48%);
                    }

                    .animButton.green.filled {
                        color: white;
                        background-color: hsl(139,calc(var(--saturation-factor, 1)*47.3%),43.9%);
                    }
                    .animButton.green.filled:hover:not(.disabled) {
                        background-color: hsl(139,calc(var(--saturation-factor, 1)*47.1%),33.3%);
                    }
                    .animButton.green.inverted {
                        color: hsl(139,calc(var(--saturation-factor, 1)*47.3%),43.9%);
                        border: 1px solid hsl(139,calc(var(--saturation-factor, 1)*47.3%),43.9%);
                    }
                    .animButton.green.inverted:hover:not(.disabled) {
                        color: hsl(139,calc(var(--saturation-factor, 1)*47.1%),33.3%);
                        border: 1px solid hsl(139,calc(var(--saturation-factor, 1)*47.1%),33.3%);
                    }

                    .animButton.underline {
                        font-weight: bold;
                        background: transparent;
                        color: white;
                    }
                    .animButton.underline:hover:not(.disabled) {
                        text-decoration: underline;
                    }

                    [class*=anim].disabled {
                        opacity: 66.66%;
                        cursor: not-allowed;
                    }
                    `

                        PluginUtilities.removeStyle(`${this.getName()}-comp`);
                        setTimeout(() => {
                            PluginUtilities.addStyle(`${this.getName()}-comp`, componentsStyles)
                            this.resetAnimations()
                        }, 100);

                        this.BadSendingStyles = (e) => {
                            if (e.key == "Enter") { // finding parent
                                var BadSendingTextNode = document.getElementsByClassName(AnimationsPlugin.modules.ChatContent)[0]
                                    ?.querySelector?.(`.${AnimationsPlugin.modules.IsSending}, .${AnimationsPlugin.modules.IsFailed}`)

                                if (document.querySelector('[class*=chatContent]'))
                                    if (!BadSendingTextNode) {
                                        setTimeout(() => {
                                            BadSendingTextNode = this.BadSendingStyles(e)
                                            return BadSendingTextNode
                                        }, 50)// frequency of checks after pressing Enter
                                    } else {
                                        var result = BadSendingTextNode.closest(`.${AnimationsPlugin.modules.Message}`);// this is where we found it
                                        // there styles for parent
                                        result.style.animation = 'none'
                                        result.style.transform = 'none'
                                    }
                            }
                        }

                        document.addEventListener('keyup', this.BadSendingStyles)

                        this.animateServers()
                        this.animateMembers()
                        this.animateChannels()

                        // on themes switch
                        this.observer = new MutationObserver(
                            (event) => {
                                const { removedNodes, addedNodes } = event[0];
                                const compabilityThemes = ['Horizontal-Server-List'];

                                ; ([removedNodes, addedNodes]).forEach(
                                    (changes, typeIndex) => changes.forEach(
                                        (node) => {
                                            if (compabilityThemes.includes(node.id)) this.resetAnimations();
                                        }
                                    )
                                )
                            }
                        )

                        var element_with_themes_switches = document.getElementsByTagName("bd-themes")[0]
                        this.observer.observe(element_with_themes_switches, { "childList": true })

                    }

                    stop() {
                        document.removeEventListener('keyup', this.BadSendingStyles);

                        clearInterval(this.animateInterval)

                        PluginUtilities.removeStyle(`${this.getName()}-main`);
                        PluginUtilities.removeStyle(`${this.getName()}-comp`);

                        this.observer.disconnect()

                    }

                    onSwitch() {
                        this.animateChannels()
                        this.animateMembers()
                    }
                }
            };
            return plugin(Plugin, Api);
        })(global.ZeresPluginLibrary.buildPlugin(config));
    }
)();
