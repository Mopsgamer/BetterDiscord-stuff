/**
 * @name PluginCleaner
 * @version 1.0.0
 * @description Clean up your plugins or fix them.
 * @author Mops
 * @invite PWtAHjBXtG
 * @authorLink https://github.com/Mopsgamer/
 * @authorId 538010208023347200
 * @website https://github.com/Mopsgamer/BetterDiscord-codes/tree/PluginCleaner
 * @source https://raw.githubusercontent.com/Mopsgamer/BetterDiscord-codes/PluginCleaner/PluginCleaner.plugin.js
 * @updateUrl https://raw.githubusercontent.com/Mopsgamer/BetterDiscord-codes/PluginCleaner/PluginCleaner.plugin.js
 */

module.exports = (meta) => {
    const path = require('path'), fs = require('fs'), electron = require('electron'), request = require('request')
    const { Webpack, React, Plugins, injectCSS, clearCSS } = BdApi

    /**
     * @typedef {object} BDPluginData
     * @property {string} author
     * @property {string} authorId
     * @property {string} authorLink
     * @property {string} name
     * @property {string} filename
     * @property {function | undefined} exports
     * @property {object | undefined} instance
     * @property {string} description
     * @property {string} version
     * @property {string} source
     * @property {string} website
     * @property {number} size
     * @property {undefined | true} partial
     */
    /**
     * @typedef {BDPluginData & {reasons: {normal: string[], warning: string[], danger: string[]}}} BDPluginDataReasons
     */

    let Listen = {}

    // CACHE

    /** Variable to track plugin list changes.
     * @type {BDPluginDataReasons[] | undefined}*/
    let CachePlugins;
    /** @type {BDPluginDataReasons[] | undefined}*/
    let UntrustedPlugins;
    /** @type {BDPluginData[] | undefined}*/
    let TrustedPlugins;
    /** @type {BDPluginData[] | undefined}*/
    let BrokenPlugins;
    /** @type {string[] | undefined}*/
    let UnusedFiles;

    /**@type {Date}*/
    let CheckDate;

    /*Settings*/
    // They will be saved until the plugin is recompiled
    let UncompiledInUntrusted = true
    /*Settings end*/

    let UntrustedPluginsWarning = {
        'XenoLib': [' •  Is used by MessageLogger.']
    }

    let UntrustedPluginsDanger = {
        'MessageLogger': [' •  **Violate the 3-rd & 4-th condition** of [Security & Privacy](https://docs.betterdiscord.app/plugins/introduction/guidelines#security--privacy).'],
        'AnimatedStatus': [' •  **Violate the 3-rd condition** of [Security & Privacy](https://docs.betterdiscord.app/plugins/introduction/guidelines#security--privacy).'],
        'Animated_Status': [' •  **Violate the 3-rd condition** of [Security & Privacy](https://docs.betterdiscord.app/plugins/introduction/guidelines#security--privacy).'],
        'PremiumScreenShare': [' •  **Violate the 3-rd condition** of [Security & Privacy](https://docs.betterdiscord.app/plugins/introduction/guidelines#security--privacy).'],
        'HiddenChannels': [' •  **Violate the 4-th condition** of [Security & Privacy](https://docs.betterdiscord.app/plugins/introduction/guidelines#security--privacy).'],
    }

    let FindedModules = {
        //components
        Button: Webpack.getModule(Webpack.Filters.byProps('Looks', 'Colors')),
        SwitchRow: Webpack.getModule(m => m.toString().includes("helpdeskArticleId")),
        Markdown: Webpack.getModule(Webpack.Filters.byProps("parseBlock", "parseInline", "defaultOutput")),

        //classes
        Margin: Webpack.getModule(Webpack.Filters.byProps('marginBottom20')),
        Title: Webpack.getModule(Webpack.Filters.byProps('title', 'subtitle')),
    }

    // CACHE end

    let CachePluginsUpdater

    class Plugin {

        start() {

            injectCSS(
                meta.name,
                `
                .pman-addon-button svg {
                    fill: white;
                    margin: auto;
                }
                .pman-addon-button:first-child {
                    margin-left: 8px;
                    border-top-left-radius: 3px;
                    border-bottom-left-radius: 3px;
                }
                .pman-addon-button:last-child {
                    border-top-right-radius: 3px;
                    border-bottom-right-radius: 3px;
                }
                .pman-addon-button {
                    display: inline-flex;
                    padding: 4px 6px;
                    transition: background-color .17s ease,color .17s ease;
                    background-color: var(--brand-experiment);
                }
                .pman-addon-button:hover {
                    background-color: var(--brand-experiment-560);
                }
                .pman-addon-button:active {
                    background-color: var(--brand-experiment-600);
                }
                .pman-addon-button.danger {
                    background-color: var(--button-danger-background);
                }
                .pman-addon-button.danger:hover {
                    background-color: var(--button-danger-background-hover);
                }
                .pman-addon-button.danger:active {
                    background-color: var(--button-danger-background-active);
                }
                .pman-addon-button.secondary {
                    background-color: var(--button-secondary-background);
                }
                .pman-addon-button.secondary:hover {
                    background-color: var(--button-secondary-background-hover);
                }
                .pman-addon-button.secondary:active {
                    background-color: var(--button-secondary-background-active);
                }
                .pman-text {
                    color: var(--header-primary);
                    margin: auto;
                }
                .pman-addon-card {
                    display: flex;
                    flex-direction: column;
                    margin-bottom: 20px;
                    border-radius: 5px;
                    overflow: hidden;
                    background: var(--background-secondary);
                }
                .pman-addon-header {
                    color: var(--header-primary);
                    background: var(--background-secondary-alt);
                    padding: 16px;
                    font-size: 14px;
                    line-height: 20px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    overflow: hidden;
                }
                .pman-controls {
                    display: flex;
                    align-items: center;
                }
                .pman-icon {
                    margin-right: 8px;
                }
                .pman-asidelabel {
                    margin-right: 8px;
                }
                .pman-title, .pman-name, .pman-meta {
                    display: inline;
                    line-height: normal;
                }
                .pman-name::after, .pman-version::after {
                    display: inline;
                    content: " ";
                }
                .pman-title {
                    flex: 1;
                }
                .pman-name {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .pman-meta, .pman-asidelabel {
                    color: var(--channels-default);
                    font-weight: 500;
                }
                .pman-description-wrap {
                    flex: 1;
                    padding: 8px 16px 0 16px;
                }
                .pman-description {
                    word-break: break-word;
                    margin-bottom: 5px;
                    padding: 5px 0;
                    overflow-y: auto;
                    max-height: 175px;
                    font-size: 14px;
                    line-height: 18px;
                    -webkit-line-clamp: 3;
                    color: var(--header-secondary);
                }
                `
                )

            // update list if `Plugins.getAll()` changed
            CachePluginsUpdater = setInterval(() => {
                if (CachePlugins?.length == Plugins?.getAll?.()?.length) return;
                if (Listen?.LIST) Listen.LIST.forceUpdate();
            }, 200)
        }

        stop() {
            clearCSS(meta.name)
            clearInterval(CachePluginsUpdater);
            this.closeSettings()
        }

        wait(ms) {
            return new Promise(rs=>setTimeout(rs, ms))
        }

        closeSettings() {
            document.querySelector('.bd-addon-modal-footer > .bd-button')?.click?.()
        }

        requestGhFile(ghApiUrl) {
            let fromBinary = (encoded) => {
                return decodeURIComponent(atob(encoded).split('').map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
            }
            return new Promise(
                (rs, rj) => {
                    const request = new XMLHttpRequest();
                    request.open("GET", ghApiUrl);
                    request.send();

                    request.onreadystatechange = (e) => {
                        if (e.currentTarget.readyState != 4) return

                        let resp = request?.responseText
                        var responseCode = (resp ? JSON.parse(resp) : undefined);
                        if (request.status != 200) {
                            rj(request.status, request.statusText ?? '')
                            return
                        }

                        var decoded = fromBinary(responseCode.content);

                        rs(decoded)
                        return
                    }
                }
            )
        }

        getSettingsPanel = () => {
            let PluginThis = this

            const { Button, Markdown, SwitchRow, Margin, Title } = FindedModules;

            function olderVersion(v1, v2) {
                var v1Dots = v1.match(/\./g).length
                var v2Dots = v2.match(/\./g).length
                const newParts = v1.split('.')
                const oldParts = v2.split('.')

                for (var i = 0; i < (v1Dots > v2Dots ? v1Dots : v2Dots) + 1; i++) {
                    const a = parseInt(newParts[i]) || 0
                    const b = parseInt(oldParts[i]) || 0
                    if (a > b) return v2
                    if (a < b) return v1
                }
                return v2
            }

            /**
             * @returns {Promise<boolean>} `true` if the operation was successful, the plugin may be faulty.
             * @param {BDPluginData} plugin
             */
            function fixplugin(plugin) {
                return new Promise(
                    (rs) => {
                        let givenurl = TrustedPlugins.find(t => t.name == plugin.name)?.latest_source_url
                        if(!givenurl) return rs(false);
                        let str = new URL(givenurl).pathname.split('/')
                        let options = {
                            user: str[1],
                            repo: str[2],
                            path: str.slice(5).join('/'),
                            branch: null
                        }
                        let uri = `https://api.github.com/repos/${options.user}/${options.repo}/contents/${options.path}${options.branch ? '?ref=' + options.branch : ''}`

                        PluginThis.requestGhFile(uri)
                        .then(
                            async content => {
                                try {
                                    fs.writeFileSync(path.join(Plugins.folder, plugin.filename), content)
                                    rs(true)
                                } catch(error) {
                                    BdApi.showToast('File writing error.', { type: 'error' })
                                    console.error(error)
                                    rs(false)
                                }
                            }
                        ).catch(
                            (status, statusText) => {
                                BdApi.showToast(status + ': The plugin can\'t be found.', { type: 'error' })
                                rs(false)
                            }
                        )
                    }
                )
            }

            class Listenable extends React.Component {
                constructor(state) {
                    let as = state.as
                    state.as = undefined
                    super(state)
                    Listen[as] = this
                }
            }

            class ListOf extends Listenable {
                constructor() {
                    super({as: 'LIST'})
                }

                render() {
                {
                    CachePlugins = Plugins.getAll();
                    {
                        if (UntrustedPlugins) UntrustedPlugins = [];
                        if (BrokenPlugins) BrokenPlugins = [];
                        for (let plug of CachePlugins) {
                            plug.reasons = {
                                normal: [],
                                warning: [...(UntrustedPluginsWarning?.[Object.keys(UntrustedPluginsWarning).find(name => plug.name.includes(name))] ?? [])],
                                danger: [...(UntrustedPluginsDanger?.[Object.keys(UntrustedPluginsDanger).find(name => plug.name.includes(name))] ?? [])],
                            };
                            if (TrustedPlugins && !TrustedPlugins.some(tplug => tplug.name == plug.name)) {
                                plug.reasons.warning.push(' •  Unlisted in the https://betterdiscord.app/plugins list.')
                            }
                            if (plug.reasons.danger.length) {
                                plug.reasons.danger.push(' •  **Discord can ban you for that.** (You have nothing to fear if you haven\'t used it)')
                            }
                            if(plug.reasons.normal.length || plug.reasons.warning.length || plug.reasons.danger.length) {
                                if (!UntrustedPlugins) UntrustedPlugins = [];
                                UntrustedPlugins.push(plug)
                            }
                            if(plug.partial) {
                                if (!BrokenPlugins) BrokenPlugins = [];
                                BrokenPlugins.push(plug)
                            }
                        }
                    }
                    {
                        if (UnusedFiles) UnusedFiles = [];
                        let dir = fs.readdirSync(Plugins.folder)
                        for(let filename of dir) {
                            let name = filename.match(/[\w\s]*/)?.[0]
                            let ext = path.parse(filename).ext
                            if (
                                !filename.endsWith('.plugin.js') &&
                                (
                                    dir.every(fname => fname.match(/[\w\s]*/)?.[0] != name && fname.endsWith('.plugin.js')) ||
                                    !CachePlugins.some(p => p.name == name)
                                )
                            ) {
                                if (!UnusedFiles) UnusedFiles = [];
                                UnusedFiles.push({
                                    name: name,
                                    filename: filename,
                                    partial: false,
                                    reasons: {
                                        normal: [
                                            ' •  The plugin ' + name + ' is missing.',
                                            ext == '.css' ? ' •  This file may be responsible for the appearance of the plugin components.'
                                                : (ext == '.json' || ext == '.txt' ? ' •  This file may be responsible for saving the plugin data.' : null)
                                        ],
                                        warning: [],
                                        danger: [],
                                    }
                                })
                            }
                        }
                    }
                }
                function builder(/**@type {BDPluginData}*/uplug) {
                    const dangerColors = {
                        normal: 'var(--header-primary)',
                        warning: 'var(--status-warning-background)',
                        danger: 'var(--status-danger-background)',
                    };

                    const dangerColorCalc = uplug.reasons.danger?.length ? dangerColors.danger : (uplug.reasons.warning?.length ? dangerColors.warning : dangerColors.normal)

                    let isPartial = uplug.partial
                    let isUnused = !uplug.instance && !isPartial
                    let isTrusted = UntrustedPlugins ? !UntrustedPlugins.includes(uplug) : true
                    return React.createElement(
                        'div',
                        { class: 'pman-addon-card' },
                        [
                            React.createElement(
                                'div',
                                { class: 'pman-addon-header' },
                                [
                                    React.createElement(
                                        'svg',
                                        {
                                            class: 'pman-icon',
                                            viewBox: isUnused ? '0 0 10 10' : '0 0 24 24',
                                            style: {
                                                fill: dangerColorCalc,
                                                width: '18px', height: '18px'
                                            }
                                        },
                                        React.createElement('path', { d: isUnused ? 'M6,7 L2,7 L2,6 L6,6 L6,7 Z M8,5 L2,5 L2,4 L8,4 L8,5 Z M8,3 L2,3 L2,2 L8,2 L8,3 Z M8.88888889,0 L1.11111111,0 C0.494444444,0 0,0.494444444 0,1.11111111 L0,8.88888889 C0,9.50253861 0.497461389,10 1.11111111,10 L8.88888889,10 C9.50253861,10 10,9.50253861 10,8.88888889 L10,1.11111111 C10,0.494444444 9.5,0 8.88888889,0 Z' : 'M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7 1.49 0 2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11z' })
                                    ),
                                    React.createElement(
                                        'div', { class: 'pman-title' },
                                        [
                                            React.createElement(
                                                'div', { class: 'pman-name', style: { color: dangerColorCalc } },
                                                isUnused ? uplug.filename : uplug.name
                                            ),
                                            React.createElement(
                                                'div', { class: 'pman-meta' },
                                                [
                                                    !uplug.version ? null : React.createElement(
                                                        'span', { class: 'pman-version' },
                                                        'v' + uplug.version
                                                    ),
                                                    !uplug.author ? null : 'by ',
                                                    !uplug.author ? null : (
                                                        uplug.authorLink?
                                                        React.createElement(
                                                            'a', { class: 'pman-link pman-link-website', href: uplug.authorLink, target: '_blank', rel: 'noopener noreferrer' },
                                                            uplug.author
                                                        ) :
                                                        React.createElement(
                                                            'span', { class: 'pman-author' },
                                                            uplug.author
                                                        )
                                                    ),
                                                    !uplug.extension ? null : React.createElement(
                                                        'span', { class: 'pman-version' },
                                                        'v' + uplug.version
                                                    )
                                                ]
                                            )
                                        ]
                                    ),
                                    React.createElement(
                                        'div', { class: 'pman-controls' },
                                        [
                                            !isPartial ? null : React.createElement(
                                                'span', { class: 'pman-asidelabel' },
                                                'Broken'
                                            ),
                                        ]
                                    ),
                                    React.createElement(
                                        'div', { class: 'pman-controls' },
                                        [
                                            (!uplug.source || !isPartial || !isTrusted || !TrustedPlugins)
                                                ? null : React.createElement(
                                                    'button',
                                                    {
                                                        class: `pman-addon-button secondary`,
                                                        onClick: (e) => {
                                                            BdApi.showConfirmationModal(
                                                                'Try to fix the plugin?',
                                                                [
                                                                    'The plugin ' + uplug.name + ' will be re-downloaded from betterdiscord.com into the plugins folder.',
                                                                    '',
                                                                    'If that didn\'t work, you can try to find the latest version, which may not be available at betterdiscord.com, and install it manually.',
                                                                    React.createElement(
                                                                        'div', { class: 'pman-controls' },
                                                                        React.createElement(
                                                                            'button',
                                                                            {
                                                                                class: `pman-addon-button secondary`,
                                                                                onClick: (e) => {
                                                                                    window.open(uplug.source)
                                                                                }
                                                                            },
                                                                            React.createElement(
                                                                                'svg',
                                                                                { style: { width: '20px', height: '20px' }, viewBox: '-2.5 -1 26 26' },
                                                                                [
                                                                                    React.createElement('path', { d: 'M21.03 7.76998C20.955 7.60998 20.81 7.48998 20.635 7.44498C20.545 7.41998 20.445 7.39498 20.35 7.36998C19.805 7.22998 19.135 7.56498 18.85 8.11498L17.87 9.99998C17.585 10.55 17.225 10.51 17.07 9.90998L14.895 1.38498C14.74 0.779981 14.14 0.459981 13.55 0.664981C12.96 0.869981 12.595 1.52498 12.725 2.13498L13.995 7.95998C14.13 8.56998 14.075 9.11498 13.875 9.18498C13.675 9.25498 13.35 8.83498 13.15 8.24498L11.05 2.07498C10.85 1.48498 10.21 1.17498 9.62004 1.37998C9.03004 1.58498 8.71504 2.22998 8.91004 2.81998L10.97 8.99998C11.165 9.58998 11.165 10.125 10.965 10.195C10.765 10.265 10.385 9.86498 10.125 9.29998L7.77504 4.29998C7.51004 3.73998 6.82004 3.44498 6.23004 3.64998C5.64504 3.85498 5.37504 4.47498 5.64004 5.03998L8.60004 11.045C8.86004 11.61 8.91004 12.125 8.71004 12.195C8.51004 12.265 8.03004 11.93 7.64004 11.445L5.60504 8.82498C5.21504 8.33998 4.54004 8.07498 4.09504 8.22998C3.65504 8.38498 3.54004 8.94498 3.84504 9.48998L6.34504 13.865C6.40004 14.02 7.85504 16.8 7.96004 16.915C9.00004 18.565 10.645 19.51 12.73 18.79L14.91 18.035C16.145 17.605 17.095 16.735 17.63 15.7C17.64 15.69 20.15 10.205 21.03 8.28498C21.105 8.11498 21.105 7.92998 21.03 7.76998Z' }),
                                                                                    React.createElement('path', { d: 'M21.3251 23.4001L19.1101 19.0301C18.8501 18.5201 18.2501 18.2851 17.7151 18.4851L12.3101 20.5101C12.0201 20.6201 11.7851 20.8451 11.6651 21.1351C11.5451 21.4251 11.5551 21.7501 11.6851 22.0301L12.3151 23.3951H21.3251V23.4001Z' }),
                                                                                ]
                                                                            )
                                                                        )
                                                                    )
                                                                ],
                                                                {
                                                                    onConfirm: async () => {
                                                                        if (await fixplugin(uplug)) BdApi.showToast('Failed to fix ' + uplug.name + '.', { type: 'error' })
                                                                        Listen.LIST.forceUpdate()
                                                                    }
                                                                }
                                                            )
                                                        }
                                                    },
                                                    React.createElement(
                                                        'svg',
                                                        { style: { width: '20px', height: '20px' }, viewBox: '-2.5 -1 26 26' },
                                                        [
                                                            React.createElement('path', { d: 'M4.3231,4.4332 C4.3231,4.4332 4.5811,4.0472 4.6881,3.8762 C4.7951,3.7052 4.4111,3.3012 4.2621,3.1732 C4.1131,3.0452 3.8781,3.1092 3.8781,3.1092 C2.0031,3.9402 1.0651,5.6452 0.9371,5.9862 C0.8091,6.3272 1.2631,6.6992 1.5981,6.8812 C1.7521,6.9652 1.9971,6.7792 2.1481,6.6412 L2.1991,6.5892 L2.2781,6.5092 L2.2791,6.5082 L7.3801,11.5892 L8.0771,10.8922 L9.3581,9.6112 L4.3161,4.4402 L4.3231,4.4332 Z' }),
                                                            React.createElement('path', { d: 'M16.3738,9.7931 L16.6428,9.5371 L19.0598,11.9311 C19.0768,11.9461 19.0948,11.9521 19.1108,11.9521 C19.1568,11.9521 19.1948,11.9101 19.1948,11.9101 C19.1948,11.9101 21.8708,9.2551 21.8798,9.2461 C21.9588,9.1681 21.8798,9.1251 21.8798,9.1251 L19.8158,7.0471 L19.8128,7.0501 L19.5298,6.7731 L19.6878,6.6211 L20.0258,6.6601 L19.9618,6.2121 L20.0468,6.1261 L19.9198,5.4801 C19.4788,4.8551 18.2708,3.8541 18.2708,3.8541 L17.6388,3.7401 L17.5748,3.8251 L17.0988,3.7541 L17.1448,4.1601 L17.1748,4.1901 L17.0338,4.3321 L16.2538,3.5691 C16.2538,3.5691 11.7278,1.1111 11.4868,0.9971 C11.3508,0.9341 11.2508,0.8921 11.1548,0.8921 C11.0808,0.8921 11.0088,0.9171 10.9258,0.9761 C10.7338,1.1111 10.8468,1.3831 10.8468,1.3831 L13.6608,6.5831 L14.2238,7.1411 L14.0478,7.3171 L14.0478,7.3171 L13.9828,7.3821 L13.5328,7.3201 L13.6018,7.7661 L13.4718,7.8961 L13.4488,7.8731 C13.4278,7.8521 13.3988,7.8411 13.3708,7.8411 C13.3428,7.8411 13.3148,7.8521 13.2928,7.8731 C13.2498,7.9161 13.2498,7.9861 13.2928,8.0291 L13.3158,8.0521 L13.2538,8.1151 L13.2378,8.0981 C13.2158,8.0771 13.1878,8.0661 13.1598,8.0661 C13.1308,8.0661 13.1028,8.0771 13.0818,8.0981 C13.0388,8.1411 13.0388,8.2111 13.0818,8.2541 L13.0988,8.2711 L11.9148,9.4611 L11.8878,9.4341 C11.8658,9.4131 11.8378,9.4021 11.8098,9.4021 C11.7818,9.4021 11.7538,9.4131 11.7318,9.4341 C11.6888,9.4771 11.6888,9.5471 11.7318,9.5901 L11.7598,9.6171 L11.6968,9.6801 L11.6758,9.6601 C11.6548,9.6381 11.6258,9.6271 11.5988,9.6271 C11.5698,9.6271 11.5418,9.6381 11.5198,9.6601 C11.4778,9.7031 11.4778,9.7721 11.5198,9.8151 L11.5408,9.8361 L11.3868,9.9921 L11.3658,10.1901 L11.4468,10.2731 L11.4448,10.2741 L11.3468,10.3741 L4.9578,16.7621 L4.8748,16.6931 L4.6098,16.7311 L4.4598,16.8831 L4.4498,16.8731 C4.4278,16.8511 4.3998,16.8401 4.3718,16.8401 C4.3438,16.8401 4.3148,16.8511 4.2938,16.8731 C4.2508,16.9161 4.2508,16.9851 4.2938,17.0281 L4.3058,17.0401 L4.2438,17.1041 L4.2378,17.0981 C4.2168,17.0761 4.1878,17.0651 4.1598,17.0651 C4.1318,17.0651 4.1038,17.0761 4.0818,17.0981 C4.0398,17.1411 4.0398,17.2101 4.0818,17.2531 L4.0888,17.2611 L2.9198,18.4501 L2.8958,18.4261 C2.8738,18.4041 2.8468,18.3941 2.8178,18.3941 C2.7898,18.3941 2.7618,18.4041 2.7398,18.4261 C2.6968,18.4691 2.6968,18.5391 2.7398,18.5821 L2.7658,18.6071 L2.7038,18.6701 L2.6848,18.6511 C2.6628,18.6301 2.6348,18.6191 2.6058,18.6191 C2.5788,18.6191 2.5498,18.6301 2.5288,18.6511 C2.4858,18.6941 2.4858,18.7641 2.5288,18.8071 L2.5488,18.8281 L2.4618,18.9171 L2.0088,18.8361 L2.0428,19.3421 L1.8998,19.4881 L2.0238,20.1701 C2.0238,20.1701 2.2138,20.7641 2.6048,21.1581 C2.9838,21.5401 3.5618,21.7231 3.5868,21.7421 L4.2398,21.8561 L4.4008,21.6981 L4.8508,21.7711 L4.7768,21.3261 L4.9138,21.1921 L4.9768,21.2551 C4.9978,21.2761 5.0258,21.2871 5.0538,21.2871 C5.0818,21.2871 5.1108,21.2761 5.1318,21.2551 C5.1748,21.2111 5.1748,21.1421 5.1318,21.0991 L5.0698,21.0371 L5.1338,20.9751 L5.1878,21.0291 C5.2088,21.0511 5.2378,21.0621 5.2658,21.0621 C5.2938,21.0621 5.3218,21.0511 5.3438,21.0291 C5.3868,20.9861 5.3868,20.9171 5.3438,20.8741 L5.2908,20.8201 L6.4778,19.6491 L6.5298,19.7011 C6.5508,19.7231 6.5798,19.7331 6.6078,19.7331 C6.6358,19.7331 6.6638,19.7231 6.6858,19.7011 C6.7278,19.6581 6.7278,19.5881 6.6858,19.5451 L6.6348,19.4951 L6.6978,19.4321 L6.7418,19.4761 C6.7628,19.4971 6.7908,19.5081 6.8188,19.5081 C6.8478,19.5081 6.8758,19.4971 6.8968,19.4761 C6.9398,19.4331 6.9398,19.3631 6.8968,19.3201 L6.8538,19.2771 L6.9868,19.1471 L7.0348,18.8621 L6.9638,18.7911 L6.9648,18.7901 L7.0938,18.6621 L13.4398,12.3141 L13.4368,12.3081 L13.5608,12.4361 L13.7598,12.4141 L13.9388,12.2341 L13.9678,12.2631 C13.9898,12.2841 14.0178,12.2951 14.0458,12.2951 C14.0738,12.2951 14.1028,12.2841 14.1238,12.2631 C14.1668,12.2201 14.1668,12.1501 14.1238,12.1071 L14.0948,12.0781 L14.1578,12.0161 L14.1798,12.0381 C14.2008,12.0591 14.2288,12.0701 14.2578,12.0701 C14.2858,12.0701 14.3138,12.0591 14.3348,12.0381 C14.3778,11.9951 14.3778,11.9251 14.3348,11.8821 L14.3128,11.8591 L15.4988,10.6711 L15.5298,10.7021 C15.5508,10.7231 15.5788,10.7341 15.6068,10.7341 C15.6358,10.7341 15.6638,10.7231 15.6848,10.7021 C15.7278,10.6591 15.7278,10.5891 15.6848,10.5461 L15.6538,10.5151 L15.7168,10.4521 L15.7408,10.4771 C15.7628,10.4981 15.7908,10.5091 15.8188,10.5091 C15.8468,10.5091 15.8748,10.4981 15.8968,10.4771 C15.9398,10.4331 15.9398,10.3641 15.8968,10.3211 L15.8728,10.2961 L16.0048,10.1641 L16.4458,10.2331 L16.3738,9.7931 Z' }),
                                                            React.createElement('polygon', { points: '17.255 16.968 14.442 14.836 13.941 14.32 12 16.261 12.488 16.727 14.321 19.476 16.793 22.183 19.642 19.525' }),
                                                        ]
                                                    )
                                                ),
                                        ]
                                    ),
                                    React.createElement(
                                        'div', { class: 'pman-controls' },
                                        [
                                            !document.getElementById(`${uplug.name}-card`)
                                                ? null : React.createElement(
                                                    'button',
                                                    {
                                                        class: `pman-addon-button`,
                                                        onClick: async (e) => {
                                                            let card = document.getElementById(`${uplug.name}-card`)
                                                            if (!card) return;
                                                            PluginThis.closeSettings()
                                                            await PluginThis.wait(500)
                                                            card.animate([{}, { transform: 'scale(1.2)' }, {}], { duration: 500 })
                                                            card.scrollIntoView({ behavior: 'smooth', block: 'center' })
                                                        }
                                                    },
                                                    React.createElement(
                                                        'svg',
                                                        { style: { width: '20px', height: '20px' }, viewBox: '0 0 24 24' },
                                                        [
                                                            React.createElement('path', { d: 'M12 5C5.648 5 1 12 1 12C1 12 5.648 19 12 19C18.352 19 23 12 23 12C23 12 18.352 5 12 5ZM12 16C9.791 16 8 14.21 8 12C8 9.79 9.791 8 12 8C14.209 8 16 9.79 16 12C16 14.21 14.209 16 12 16Z' }),
                                                            React.createElement('path', { d: 'M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z' })
                                                        ]
                                                    )
                                                ),
                                            React.createElement(
                                                'button',
                                                {
                                                    class: `pman-addon-button`,
                                                    onClick: (e) => {
                                                        electron.shell.showItemInFolder(path.join(Plugins.folder, uplug.filename))
                                                    }
                                                },
                                                React.createElement(
                                                    'svg',
                                                    { style: { width: '20px', height: '20px' }, viewBox: '0 0 24 24' },
                                                    [
                                                        React.createElement('path', { d: 'M20 7H12L10.553 5.106C10.214 4.428 9.521 4 8.764 4H3C2.447 4 2 4.447 2 5V19C2 20.104 2.895 21 4 21H20C21.104 21 22 20.104 22 19V9C22 7.896 21.104 7 20 7Z' })
                                                    ]
                                                )
                                            )
                                        ]
                                    ),
                                    React.createElement(
                                        'div', { class: 'pman-controls' },
                                        [
                                            React.createElement(
                                                'button',
                                                {
                                                    class: `pman-addon-button danger`,
                                                    onClick: (e) => {
                                                        BdApi.UI.showConfirmationModal('Delete the file?', `${uplug.filename} will be deleted.`, {
                                                            danger: true,
                                                            onConfirm() {
                                                                try {
                                                                    fs.rmSync(path.join(Plugins.folder, uplug.filename))
                                                                    BdApi.showToast(uplug.filename + ' have been deleted.', { type: 'info' })
                                                                } catch {
                                                                    BdApi.showToast(uplug.filename + ' cannot be deleted.', { type: 'error' })
                                                                }
                                                                Listen.LIST.forceUpdate()
                                                            }
                                                        })
                                                    }
                                                },
                                                React.createElement(
                                                    'svg',
                                                    { style: { width: '20px', height: '20px' }, viewBox: '0 0 24 24' },
                                                    [
                                                        React.createElement('path', { d: 'M15 3.999V2H9V3.999H3V5.999H21V3.999H15Z' }),
                                                        React.createElement('path', { d: 'M5 6.99902V18.999C5 20.101 5.897 20.999 7 20.999H17C18.103 20.999 19 20.101 19 18.999V6.99902H5ZM11 17H9V11H11V17ZM15 17H13V11H15V17Z' })
                                                    ]
                                                )
                                            )
                                        ]
                                    )
                                ]
                            ),
                            isTrusted ? null : React.createElement(
                                'div',
                                { class: 'pman-description-wrap' },
                                [
                                    React.createElement(
                                        'div',
                                        { class: 'pman-description' },
                                        [
                                            React.createElement(
                                                'div', { style: {} },
                                                (uplug.reasons.normal).map(text => !text ? text : Markdown.markdownToReact(text))
                                            ),
                                            React.createElement(
                                                'div', { style: { color: dangerColors.warning } },
                                                (uplug.reasons.warning).map(text => !text ? text : Markdown.markdownToReact(text))
                                            ),
                                            React.createElement(
                                                'div', { style: { color: dangerColors.danger } },
                                                (uplug.reasons.danger).map(text => !text ? text : Markdown.markdownToReact(text))
                                            ),
                                        ]
                                    )
                                ]
                            )
                        ]
                    )
                }
                return [
                    React.createElement(
                        'div', { class: `${Margin.marginBottom8}`, style: { display: 'grid', gridTemplateColumns: '3fr 1.5fr', gridTemplateRows: 'auto' } },
                        [
                            React.createElement('div', { class: 'pman-text' }, 'Unknown plugins: ' + (UntrustedPlugins?.length ?? 0) + (!CheckDate ? '' : ' (' + CheckDate.toLocaleString() + ')')),
                            React.createElement(
                                Button,
                                {
                                    color: Button.Colors.BRAND,
                                    size: Button.Sizes.SMALL,
                                    onClick: async (e) => {
                                        e.target.toggleAttribute('disabled', true)
                                        request.get('https://api.betterdiscord.app/v1/store/addons',
                                            async (error, r, body) => {
                                                if (error) {
                                                    e.target.toggleAttribute('disabled', false)
                                                    return;
                                                }
                                                TrustedPlugins = JSON.parse(body).filter(addon => addon.type == 'plugin')
                                                CheckDate = new Date()
                                                e.target.toggleAttribute('disabled', false)
                                                Listen.LIST.forceUpdate()
                                            }
                                        )
                                    }
                                },
                                React.createElement(
                                    'svg', { style: { width: '20px', height: '20px' }, viewBox: '0 0 16 16', fill: 'white' },
                                    React.createElement('path', { d: 'M1.25 0.5H4.25C4.66475 0.5 5 0.836 5 1.25V4.25C5 4.664 4.66475 5 4.25 5H1.25C0.836 5 0.5 4.664 0.5 4.25V1.25C0.5 0.836 0.836 0.5 1.25 0.5ZM1.25 5.75H4.25C4.66475 5.75 5 6.086 5 6.5V9.5C5 9.914 4.66475 10.25 4.25 10.25H1.25C0.836 10.25 0.5 9.914 0.5 9.5V6.5C0.5 6.086 0.836 5.75 1.25 5.75ZM4.25 11H1.25C0.836 11 0.5 11.336 0.5 11.75V14.75C0.5 15.164 0.836 15.5 1.25 15.5H4.25C4.66475 15.5 5 15.164 5 14.75V11.75C5 11.336 4.66475 11 4.25 11ZM6.5 2H15.5V3.5H6.5V2ZM15.5 7.25H6.5V8.75H15.5V7.25ZM6.5 12.5H15.5V14H6.5V12.5Z' })
                                )
                            )
                        ]
                    ),
                    !UntrustedPlugins ? null : React.createElement(
                        'div',
                        {
                            id: 'pman-plugins-container',
                            class: `pman-addon-list`,
                            style: { "margin-top": "10px" }
                        },
                        UntrustedPlugins.map(builder)
                    ),
                    React.createElement(
                        'div', { class: `${Margin.marginBottom8}`, style: { display: 'grid', gridTemplateColumns: '3fr 1.5fr', gridTemplateRows: 'auto' } },
                        [
                            React.createElement('div', { class: 'pman-text' }, 'Broken plugins: ' + (BrokenPlugins?.length ?? 0)),
                            React.createElement(
                                Button,
                                {
                                    color: Button.Colors.BRAND,
                                    disabled: !BrokenPlugins?.length || !TrustedPlugins || !TrustedPlugins.find(t => BrokenPlugins.some(b => b.name == t.name))?.latest_source_url,
                                    size: Button.Sizes.SMALL,
                                    onClick: async (e) => {
                                        e.target.toggleAttribute('disabled', true)
                                        if (BrokenPlugins) for(let broken of BrokenPlugins) {
                                            await fixplugin(broken)
                                        }
                                        e.target.toggleAttribute('disabled', false)
                                        Listen.LIST.forceUpdate()
                                    }
                                },
                                React.createElement(
                                    'svg',
                                    { style: { width: '20px', height: '20px' }, fill: 'white', viewBox: '-2.5 -1 26 26' },
                                    [
                                        React.createElement('path', { d: 'M4.3231,4.4332 C4.3231,4.4332 4.5811,4.0472 4.6881,3.8762 C4.7951,3.7052 4.4111,3.3012 4.2621,3.1732 C4.1131,3.0452 3.8781,3.1092 3.8781,3.1092 C2.0031,3.9402 1.0651,5.6452 0.9371,5.9862 C0.8091,6.3272 1.2631,6.6992 1.5981,6.8812 C1.7521,6.9652 1.9971,6.7792 2.1481,6.6412 L2.1991,6.5892 L2.2781,6.5092 L2.2791,6.5082 L7.3801,11.5892 L8.0771,10.8922 L9.3581,9.6112 L4.3161,4.4402 L4.3231,4.4332 Z' }),
                                        React.createElement('path', { d: 'M16.3738,9.7931 L16.6428,9.5371 L19.0598,11.9311 C19.0768,11.9461 19.0948,11.9521 19.1108,11.9521 C19.1568,11.9521 19.1948,11.9101 19.1948,11.9101 C19.1948,11.9101 21.8708,9.2551 21.8798,9.2461 C21.9588,9.1681 21.8798,9.1251 21.8798,9.1251 L19.8158,7.0471 L19.8128,7.0501 L19.5298,6.7731 L19.6878,6.6211 L20.0258,6.6601 L19.9618,6.2121 L20.0468,6.1261 L19.9198,5.4801 C19.4788,4.8551 18.2708,3.8541 18.2708,3.8541 L17.6388,3.7401 L17.5748,3.8251 L17.0988,3.7541 L17.1448,4.1601 L17.1748,4.1901 L17.0338,4.3321 L16.2538,3.5691 C16.2538,3.5691 11.7278,1.1111 11.4868,0.9971 C11.3508,0.9341 11.2508,0.8921 11.1548,0.8921 C11.0808,0.8921 11.0088,0.9171 10.9258,0.9761 C10.7338,1.1111 10.8468,1.3831 10.8468,1.3831 L13.6608,6.5831 L14.2238,7.1411 L14.0478,7.3171 L14.0478,7.3171 L13.9828,7.3821 L13.5328,7.3201 L13.6018,7.7661 L13.4718,7.8961 L13.4488,7.8731 C13.4278,7.8521 13.3988,7.8411 13.3708,7.8411 C13.3428,7.8411 13.3148,7.8521 13.2928,7.8731 C13.2498,7.9161 13.2498,7.9861 13.2928,8.0291 L13.3158,8.0521 L13.2538,8.1151 L13.2378,8.0981 C13.2158,8.0771 13.1878,8.0661 13.1598,8.0661 C13.1308,8.0661 13.1028,8.0771 13.0818,8.0981 C13.0388,8.1411 13.0388,8.2111 13.0818,8.2541 L13.0988,8.2711 L11.9148,9.4611 L11.8878,9.4341 C11.8658,9.4131 11.8378,9.4021 11.8098,9.4021 C11.7818,9.4021 11.7538,9.4131 11.7318,9.4341 C11.6888,9.4771 11.6888,9.5471 11.7318,9.5901 L11.7598,9.6171 L11.6968,9.6801 L11.6758,9.6601 C11.6548,9.6381 11.6258,9.6271 11.5988,9.6271 C11.5698,9.6271 11.5418,9.6381 11.5198,9.6601 C11.4778,9.7031 11.4778,9.7721 11.5198,9.8151 L11.5408,9.8361 L11.3868,9.9921 L11.3658,10.1901 L11.4468,10.2731 L11.4448,10.2741 L11.3468,10.3741 L4.9578,16.7621 L4.8748,16.6931 L4.6098,16.7311 L4.4598,16.8831 L4.4498,16.8731 C4.4278,16.8511 4.3998,16.8401 4.3718,16.8401 C4.3438,16.8401 4.3148,16.8511 4.2938,16.8731 C4.2508,16.9161 4.2508,16.9851 4.2938,17.0281 L4.3058,17.0401 L4.2438,17.1041 L4.2378,17.0981 C4.2168,17.0761 4.1878,17.0651 4.1598,17.0651 C4.1318,17.0651 4.1038,17.0761 4.0818,17.0981 C4.0398,17.1411 4.0398,17.2101 4.0818,17.2531 L4.0888,17.2611 L2.9198,18.4501 L2.8958,18.4261 C2.8738,18.4041 2.8468,18.3941 2.8178,18.3941 C2.7898,18.3941 2.7618,18.4041 2.7398,18.4261 C2.6968,18.4691 2.6968,18.5391 2.7398,18.5821 L2.7658,18.6071 L2.7038,18.6701 L2.6848,18.6511 C2.6628,18.6301 2.6348,18.6191 2.6058,18.6191 C2.5788,18.6191 2.5498,18.6301 2.5288,18.6511 C2.4858,18.6941 2.4858,18.7641 2.5288,18.8071 L2.5488,18.8281 L2.4618,18.9171 L2.0088,18.8361 L2.0428,19.3421 L1.8998,19.4881 L2.0238,20.1701 C2.0238,20.1701 2.2138,20.7641 2.6048,21.1581 C2.9838,21.5401 3.5618,21.7231 3.5868,21.7421 L4.2398,21.8561 L4.4008,21.6981 L4.8508,21.7711 L4.7768,21.3261 L4.9138,21.1921 L4.9768,21.2551 C4.9978,21.2761 5.0258,21.2871 5.0538,21.2871 C5.0818,21.2871 5.1108,21.2761 5.1318,21.2551 C5.1748,21.2111 5.1748,21.1421 5.1318,21.0991 L5.0698,21.0371 L5.1338,20.9751 L5.1878,21.0291 C5.2088,21.0511 5.2378,21.0621 5.2658,21.0621 C5.2938,21.0621 5.3218,21.0511 5.3438,21.0291 C5.3868,20.9861 5.3868,20.9171 5.3438,20.8741 L5.2908,20.8201 L6.4778,19.6491 L6.5298,19.7011 C6.5508,19.7231 6.5798,19.7331 6.6078,19.7331 C6.6358,19.7331 6.6638,19.7231 6.6858,19.7011 C6.7278,19.6581 6.7278,19.5881 6.6858,19.5451 L6.6348,19.4951 L6.6978,19.4321 L6.7418,19.4761 C6.7628,19.4971 6.7908,19.5081 6.8188,19.5081 C6.8478,19.5081 6.8758,19.4971 6.8968,19.4761 C6.9398,19.4331 6.9398,19.3631 6.8968,19.3201 L6.8538,19.2771 L6.9868,19.1471 L7.0348,18.8621 L6.9638,18.7911 L6.9648,18.7901 L7.0938,18.6621 L13.4398,12.3141 L13.4368,12.3081 L13.5608,12.4361 L13.7598,12.4141 L13.9388,12.2341 L13.9678,12.2631 C13.9898,12.2841 14.0178,12.2951 14.0458,12.2951 C14.0738,12.2951 14.1028,12.2841 14.1238,12.2631 C14.1668,12.2201 14.1668,12.1501 14.1238,12.1071 L14.0948,12.0781 L14.1578,12.0161 L14.1798,12.0381 C14.2008,12.0591 14.2288,12.0701 14.2578,12.0701 C14.2858,12.0701 14.3138,12.0591 14.3348,12.0381 C14.3778,11.9951 14.3778,11.9251 14.3348,11.8821 L14.3128,11.8591 L15.4988,10.6711 L15.5298,10.7021 C15.5508,10.7231 15.5788,10.7341 15.6068,10.7341 C15.6358,10.7341 15.6638,10.7231 15.6848,10.7021 C15.7278,10.6591 15.7278,10.5891 15.6848,10.5461 L15.6538,10.5151 L15.7168,10.4521 L15.7408,10.4771 C15.7628,10.4981 15.7908,10.5091 15.8188,10.5091 C15.8468,10.5091 15.8748,10.4981 15.8968,10.4771 C15.9398,10.4331 15.9398,10.3641 15.8968,10.3211 L15.8728,10.2961 L16.0048,10.1641 L16.4458,10.2331 L16.3738,9.7931 Z' }),
                                        React.createElement('polygon', { points: '17.255 16.968 14.442 14.836 13.941 14.32 12 16.261 12.488 16.727 14.321 19.476 16.793 22.183 19.642 19.525' }),
                                    ]
                                )
                            ),
                        ]
                    ),
                    !BrokenPlugins ? null : React.createElement(
                        'div',
                        {
                            id: 'pman-plugins-container',
                            class: `pman-addon-list`,
                            style: { "margin-top": "10px" }
                        },
                        BrokenPlugins.map(builder)
                    ),
                    React.createElement(
                        'div', { class: `${Margin.marginBottom8}`, style: { display: 'grid', gridTemplateColumns: '3fr 1.5fr', gridTemplateRows: 'auto' } },
                        [
                            React.createElement('div', { class: 'pman-text' }, 'Unused files: ' + (UnusedFiles?.length ?? 0)),
                            React.createElement(
                                Button,
                                {
                                    color: Button.Colors.RED,
                                    disabled: !UnusedFiles?.length,
                                    size: Button.Sizes.SMALL,
                                    onClick: async () => {
                                        if (UnusedFiles) BdApi.UI.showConfirmationModal('Delete the files?', [UnusedFiles?.length + ' files will be deleted:', ...UnusedFiles.map(u => u.filename)], {
                                            danger: true,
                                            onConfirm() {
                                                UnusedFiles.forEach(unused => {
                                                    try {
                                                        fs.rmSync(path.join(Plugins.folder, unused.filename))
                                                        BdApi.showToast(UnusedFiles.length + ' files have been deleted.', { type: 'info' })
                                                    } catch {
                                                    }
                                                })
                                                Listen.LIST.forceUpdate()
                                            }
                                        })
                                    }
                                },
                                React.createElement(
                                    'svg',
                                    { style: { width: '20px', height: '20px' }, fill: 'white', viewBox: '0 0 24 24' },
                                    [
                                        React.createElement('path', { d: 'M15 3.999V2H9V3.999H3V5.999H21V3.999H15Z' }),
                                        React.createElement('path', { d: 'M5 6.99902V18.999C5 20.101 5.897 20.999 7 20.999H17C18.103 20.999 19 20.101 19 18.999V6.99902H5ZM11 17H9V11H11V17ZM15 17H13V11H15V17Z' })
                                    ]
                                )
                            ),
                        ]
                    ),
                    !UnusedFiles ? null : React.createElement(
                        'div',
                        {
                            id: 'pman-plugins-container',
                            class: `pman-addon-list`,
                            style: { "margin-top": "10px" }
                        },
                        UnusedFiles.map(builder)
                    ),
                ]
            }
            }

            class SettingSwitcher extends React.Component {
                constructor(state) {
                    super(state)
                    this.state = {
                        value: state?.value,
                        onSwitch: state?.onSwitch
                    }
                }
                render() {
                    return React.createElement(
                        SwitchRow,
                        {
                            value: this.state?.value,
                            onChange: (e) => {
                                this.setState({ value: this.state?.onSwitch?.(PluginThis, this) })
                                Listen.LIST.forceUpdate()
                            }
                        },
                        this.props.children
                    )
                }
            }

            return [
                React.createElement(
                    SettingSwitcher,
                    {
                        value: UncompiledInUntrusted,
                        onSwitch: () => {
                            UncompiledInUntrusted = !UncompiledInUntrusted
                            Listen.LIST.forceUpdate()
                            return UncompiledInUntrusted
                        }
                    },
                    'Uncompiled plugins'
                ),
                React.createElement(ListOf),
            ]
        }
    }
    return new Plugin
}