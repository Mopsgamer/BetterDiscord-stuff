/**
 * @name PluginCleaner
 * @version 1.1.0
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
    const { Webpack, React, Plugins, ContextMenu, injectCSS, clearCSS } = BdApi
    const Logger = class Logger {

        static error(module, ...message) { Logger.fastlogfn(module, message, "error"); }

        static warning(module, ...message) { Logger.fastlogfn(module, message, "warn"); }

        static info(module, ...message) { Logger.fastlogfn(module, message, "info"); }

        static debug(module, ...message) { Logger.fastlogfn(module, message, "debug"); }

        static log(module, ...message) { Logger.fastlogfn(module, message); }

        static fastlogfn(module, message, type = "log") {
            if (!Array.isArray(message)) message = [message];
            console[type](`%c[${meta.name}]%c %c[${module}]%c`, "color: #3a71c1; font-weight: 700;", "", "color: #3a71c1; font-weight: 500;", "", ...message);
        }

    }

    /**
     * @typedef {object} objectGuild
     * @property {string} guild.avatar_hash
     * @property {string} guild.invite_link
     * @property {string} guild.name
     * @property {string} guild.snowflake
     */

    /**
     * @typedef {object} BDWebPluginData
     * @property {object | null} author
     * @property {string} author.discord_avatar_hash
     * @property {string} author.discord_name
     * @property {string} author.display_name
     * @property {string} author.github_id
     * @property {string} author.github_name
     * @property {objectGuild | null} author.guild
     * @property {string} guild
     * @property {objectGuild | null} guild
     * @property {string} name
     * @property {string} type
     * @property {string} version
     * @property {string[]} tags
     * @property {string} release_date
     * @property {string} description
     * @property {number} downloads
     * @property {number} likes
     * @property {number} id
     * @property {string} latest_source_url
     * @property {string || null} thumbnail_url
     */

    /**
     * @typedef {object} BDPluginData
     * @property {string} author
     * @property {string} authorId
     * @property {string} authorLink
     * @property {string} name
     * @property {string} filename
     * @property {function | undefined} exports
     * @property {object | undefined} instance
     * @property {string} invite
     * @property {string} description
     * @property {string} version
     * @property {string} source
     * @property {string} updateUrl
     * @property {string} website
     * @property {number} size
     * @property {undefined | true} partial
     */
    /**
     * @typedef {BDPluginData & {reasons: {normal: string[], warning: string[], danger: string[]}}} BDPluginDataReasons
     */

    let Listen = {}
    function wait(ms) {
        return new Promise(rs => setTimeout(rs, ms))
    }

    // CACHE

    /** Variable to track plugin list changes.
     * @type {BDPluginDataReasons[] | undefined}*/
    let CachePlugins;
    /** @type {BDPluginDataReasons[] | undefined}*/
    let DistrustedPlugins;
    /** @type {BDWebPluginData[] | undefined}*/
    let TrustedPlugins;
    /** @type {BDPluginData[] | undefined}*/
    let BrokenPlugins;
    /** @type {string[] | undefined}*/
    let UnusedFiles;

    /**@type {Date}*/
    let CheckDate;

    /*Settings*/
    // They will be saved until the plugin is recompiled

    /*Settings end*/

    let DistrustedPluginsWarning = {
        'XenoLib': [' •  Is used by MessageLogger.']
    }

    let DistrustedPluginsDanger = {
        'MessageLogger': [' •  **Violate the 3-rd & 4-th condition** of [Security & Privacy](https://docs.betterdiscord.app/plugins/introduction/guidelines#security--privacy).'],
        'AnimatedStatus': [' •  **Violate the 3-rd condition** of [Security & Privacy](https://docs.betterdiscord.app/plugins/introduction/guidelines#security--privacy).'],
        'Animated_Status': [' •  **Violate the 3-rd condition** of [Security & Privacy](https://docs.betterdiscord.app/plugins/introduction/guidelines#security--privacy).'],
        'PremiumScreenShare': [' •  **Violate the 3-rd condition** of [Security & Privacy](https://docs.betterdiscord.app/plugins/introduction/guidelines#security--privacy).'],
        'HiddenChannels': [' •  **Violate the 4-th condition** of [Security & Privacy](https://docs.betterdiscord.app/plugins/introduction/guidelines#security--privacy).'],
    }

    let ModuleStore = {
        //components
        Button: Webpack.getModule(Webpack.Filters.byProps('Looks', 'Colors'), { searchExports: true }),
        SwitchRow: Webpack.getModule(Webpack.Filters.byStrings('tooltipNote', 'divider'), { searchExports: true }),
        Markdown: Webpack.getModule(Webpack.Filters.byProps('parseBlock', 'parseInline', 'defaultOutput')),
    }

    Object.values(ModuleStore).some(m => m == void 0)
        ? Logger.error('Modules', ModuleStore)
        : Logger.log('Modules', ModuleStore)

    /**Plugin names array.
     * @type {string[]}*/
    let PendingFix = []

    let CachePluginsUpdater
    let FolderWatcher

    // CACHE end

    function encodeBase64 (encoded) {
        return decodeURIComponent(atob(encoded).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    }

    function isDOM(string = '') {
        return /^\s*</.test(string)
    }

    class Plugin {

        load() {
            this.fetchTrustedPlugins()
        }

        start() {
            injectCSS(
                meta.name,
                `
                .plgcln-category-header {
                    display: grid;
                    grid-template-columns: 3fr auto;
                    grid-template-rows: auto;
                    gap: 5px;
                    border-top: thin solid var(--background-modifier-accent);
                    padding: 5px;
                    min-height: 30px;
                }
                .plgcln-addon-button svg {
                    fill: white;
                    margin: auto;
                }
                .plgcln-addon-button:first-child {
                    margin-left: 8px;
                    border-top-left-radius: 3px;
                    border-bottom-left-radius: 3px;
                }
                .plgcln-addon-button:last-child {
                    border-top-right-radius: 3px;
                    border-bottom-right-radius: 3px;
                }
                .plgcln-addon-button {
                    display: inline-flex;
                    padding: 4px 6px;
                    transition: background-color .17s ease,color .17s ease;
                    background-color: var(--brand-experiment);
                }
                .plgcln-addon-button:hover {
                    background-color: var(--brand-experiment-560);
                }
                .plgcln-addon-button:active {
                    background-color: var(--brand-experiment-600);
                }
                .plgcln-addon-button.danger {
                    background-color: var(--button-danger-background);
                }
                .plgcln-addon-button.danger:hover {
                    background-color: var(--button-danger-background-hover);
                }
                .plgcln-addon-button.danger:active {
                    background-color: var(--button-danger-background-active);
                }
                .plgcln-addon-button.secondary {
                    background-color: var(--button-secondary-background);
                }
                .plgcln-addon-button.secondary:hover {
                    background-color: var(--button-secondary-background-hover);
                }
                .plgcln-addon-button.secondary:active {
                    background-color: var(--button-secondary-background-active);
                }
                .plgcln-text {
                    color: var(--header-primary);
                    margin: auto 0;
                }
                .plgcln-addon-card {
                    display: flex;
                    flex-direction: column;
                    margin-bottom: 20px;
                    border-radius: 5px;
                    overflow: hidden;
                    background: var(--background-secondary);
                }
                .plgcln-addon-header {
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
                    flex-flow: wrap;
                }
                .plgcln-controls {
                    display: flex;
                    align-items: center;
                }
                .plgcln-icon {
                    margin-right: 8px;
                }
                .plgcln-title, .plgcln-name, .plgcln-meta {
                    display: inline;
                    line-height: normal;
                }
                .plgcln-name::after, .plgcln-version::after {
                    display: inline;
                    content: " ";
                }
                .plgcln-title {
                    flex: 1;
                }
                .plgcln-name {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .plgcln-meta, .plgcln-asidelabel {
                    color: var(--channels-default);
                    font-weight: 500;
                }
                .plgcln-description-wrap {
                    flex: 1;
                    padding: 8px 16px 0 16px;
                }
                .plgcln-description {
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

            CachePluginsUpdater = setInterval(() => {
                if (!CachePlugins) return;
                let newest = Plugins.getAll()
                if (
                    CachePlugins.length == newest.length && CachePlugins
                    ?.every?.(cp => newest.some(p => p.name == cp.name && p.partial == cp.partial))
                    ) return;

                if (Listen?.LIST) Listen.LIST.forceUpdate();
                if (CheckDate - Date.now() > 60000 * 60 * 24 ) this.fetchTrustedPlugins();
            }, 200)
            FolderWatcher = fs.watch(Plugins.folder, () => { if (Listen?.LIST) Listen.LIST.forceUpdate(); })
        }

        stop() {
            clearCSS(meta.name)
            clearInterval(CachePluginsUpdater);
            this.closeSettingsPanel();
            FolderWatcher.close();
        }

        closeSettingsPanel() {
            if(document.querySelector('.bd-addon-modal > div:first-child')?.innerText?.includes?.(`${meta.name} Settings`))
            document.querySelector('.bd-addon-modal-footer > .bd-button')?.click?.()
        }

        fetchTrustedPlugins() {
            request.get('https://api.betterdiscord.app/v1/store/addons',
                async (error, r, body) => {
                    if (error) return;
                    TrustedPlugins = JSON.parse(body).filter(addon => addon.type == 'plugin')
                    CheckDate = new Date()
                    if (Listen?.LIST) Listen.LIST.forceUpdate()
                }
            )
        }

        getSettingsPanel = () => {
            let PluginThis = this

            const { Button, SwitchRow, Markdown } = ModuleStore;

            /**
             * @param {BDPluginData} plugin
             * @returns {Promise<boolean>} File has changed.
             */
            function fixplugin(plugin) {
                if(PendingFix.includes(plugin.name) || !BrokenPlugins.find(broken => broken.name == plugin.name)) return false;
                PendingFix.push(plugin.name)
                BdApi.showToast(`The search for a fix for the ${plugin.name} has begun.`, { type: 'info' })
                return new Promise(
                    async (rs, rj) => {
                        function fn(body) {
                            if (typeof(body) != 'string' || isDOM(body)) return;
                            try {
                                let diff = fs.readFileSync(path.join(Plugins.folder, plugin.filename)).toString() != body
                                if (diff) {
                                    fs.writeFileSync(path.join(Plugins.folder, plugin.filename), body)
                                    return true;
                                } else return false;
                            } catch (error) {
                                BdApi.showToast('File writing error.', { type: 'error' })
                                return error;
                            }
                        }

                        let fnresult;
                        let pluginTrusted = TrustedPlugins?.find?.(p => p.name == plugin.name)
                        let bdlinkraw = ('https://raw.githubusercontent.com' + pluginTrusted?.latest_source_url?.match?.(/^https:\/\/github\.com(?=(.+))/)?.[1]).replace('/blob', '')
                        for (let link of [...new Set([plugin.source, plugin.updateUrl, pluginTrusted ? bdlinkraw : 0].filter(_ => _))]) {
                            if (fnresult == true) break;
                            await new Promise(rs_ => request.get({ url: link, headers: { 'Content-type': 'text/plain' } }, (error, r, body) => { fnresult = fn(body); rs_(); }))
                        }
                        if(fnresult instanceof Error) rj(fnresult)
                        else rs(fnresult)
                    }
                )
                    .then(changed => changed ? BdApi.showToast(`Fix for the ${plugin.name} was found.`, { type: 'info' }) : BdApi.showToast(`No fix for the ${plugin.name} was found.`, { type: 'warn' }))
                    .catch(error => Logger.error('Fixer', error))
                    .finally(_ => PendingFix.splice(PendingFix.indexOf(plugin.name), 1))
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
                    super({ as: 'LIST' })
                }

                render() {
                    {
                        CachePlugins = Plugins.getAll();
                        {
                            if (DistrustedPlugins) DistrustedPlugins = [];
                            if (BrokenPlugins) BrokenPlugins = [];
                            for (let plug of CachePlugins) {
                                plug.reasons = {
                                    normal: [],
                                    warning: [...(DistrustedPluginsWarning?.[Object.keys(DistrustedPluginsWarning).find(name => plug.name.includes(name))] ?? [])],
                                    danger: [...(DistrustedPluginsDanger?.[Object.keys(DistrustedPluginsDanger).find(name => plug.name.includes(name))] ?? [])],
                                };
                                if (TrustedPlugins && !TrustedPlugins.some(tplug => tplug.name == plug.name)) {
                                    plug.reasons.warning.push(' •  Unlisted in the [Plugins](https://betterdiscord.app/plugins) list.')
                                }
                                if (plug.reasons.danger.length) {
                                    plug.reasons.danger.push(' •  **Discord can ban you for that.** (You have nothing to fear if you haven\'t used it)')
                                }
                                if (plug.reasons.normal.length || plug.reasons.warning.length || plug.reasons.danger.length) {
                                    if (!DistrustedPlugins) DistrustedPlugins = [];
                                    DistrustedPlugins.push(plug)
                                }
                                if (plug.partial) {
                                    if (!BrokenPlugins) BrokenPlugins = [];
                                    BrokenPlugins.push(plug)
                                }
                            }
                        }
                        {
                            if (UnusedFiles) UnusedFiles = [];
                            let dir = fs.readdirSync(Plugins.folder)
                            for (let filename of dir) {
                                let name = filename.match(/[^\.]*/)?.[0]
                                let ext = path.parse(filename).ext
                                if (filename.endsWith('.plugin.js')) continue;
                                if ( // filename is unused file
                                    dir.filter(f => f.endsWith('.plugin.js'))
                                        .every(
                                            pluginfilename => {
                                                let pluginname = pluginfilename.match(/[^\.]*/)?.[0]
                                                let rg = new RegExp(`\\d*${name}`)
                                                return pluginname && !rg.test(pluginname)
                                            }
                                        )
                                        && CachePlugins.every(p => !name.includes(p.name))
                                    ) {
                                    // then
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
                    function builder(/**@type {BDPluginData}*/plugin) {
                        const dangerColors = {
                            normal: 'var(--header-primary)',
                            warning: 'var(--status-warning-background)',
                            danger: 'var(--status-danger-background)',
                        };

                        const dangerColorCalc = plugin.reasons.danger?.length ? dangerColors.danger : (plugin.reasons.warning?.length ? dangerColors.warning : dangerColors.normal)

                        let isPartial = plugin.partial
                        let isUnused = !plugin.instance && !isPartial
                        let isTrusted = DistrustedPlugins ? !DistrustedPlugins.includes(plugin) : true
                        return React.createElement(
                            'div',
                            { class: 'plgcln-addon-card' },
                            [
                                React.createElement(
                                    'div',
                                    { class: 'plgcln-addon-header' },
                                    [
                                        React.createElement(
                                            'svg',
                                            {
                                                class: 'plgcln-icon',
                                                viewBox: isUnused ? '0 0 10 10' : '0 0 24 24',
                                                style: {
                                                    fill: dangerColorCalc,
                                                    width: '18px', height: '18px'
                                                }
                                            },
                                            React.createElement('path', {
                                                d: isUnused ?
                                                    'M6,7 L2,7 L2,6 L6,6 L6,7 Z M8,5 L2,5 L2,4 L8,4 L8,5 Z M8,3 L2,3 L2,2 L8,2 L8,3 Z M8.88888889,0 L1.11111111,0 C0.494444444,0 0,0.494444444 0,1.11111111 L0,8.88888889 C0,9.50253861 0.497461389,10 1.11111111,10 L8.88888889,10 C9.50253861,10 10,9.50253861 10,8.88888889 L10,1.11111111 C10,0.494444444 9.5,0 8.88888889,0 Z'
                                                    : isPartial ?
                                                        'M 20.5 11 H 19 V 7 L 15 9 L 16 12 L 12 14 L 14 12 L 12 9 L 14 5 l -1 0 V 3.5 C 13 2.12 11.88 1 10.5 1 S 8 2.12 8 3.5 V 5 H 4 c -1.1 0 -1.99 0.9 -1.99 2 v 3.8 H 3.5 c 1.49 0 2.7 1.21 2.7 2.7 s -1.21 2.7 -2.7 2.7 H 2 V 20 c 0 1.1 0.9 2 2 2 h 3.8 v -1.5 c 0 -1.49 1.21 -2.7 2.7 -2.7 c 1.49 0 2.7 1.21 2.7 2.7 V 22 H 17 c 1.1 0 2 -0.9 2 -2 v -4 h 1.5 c 1.38 0 3.5 -2 0.5 -3 S 21.88 11 20.5 11 z'
                                                        : 'M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7 1.49 0 2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11z'
                                            })
                                        ),
                                        React.createElement(
                                            'div', { class: 'plgcln-title' },
                                            [
                                                React.createElement(
                                                    'div', { class: 'plgcln-name', style: { color: dangerColorCalc } },
                                                    isUnused ? plugin.filename : plugin.name
                                                ),
                                                React.createElement('br'),
                                                React.createElement(
                                                    'div', { class: 'plgcln-meta' },
                                                    [
                                                        !plugin.version ? null : React.createElement(
                                                            'span', { class: 'plgcln-version' },
                                                            'v' + plugin.version
                                                        ),
                                                        !plugin.author ? null : 'by ',
                                                        !plugin.author ? null : (
                                                            plugin.authorLink ?
                                                                React.createElement(
                                                                    'a', { class: 'plgcln-link plgcln-link-website', href: plugin.authorLink, target: '_blank', rel: 'noopener noreferrer' },
                                                                    plugin.author
                                                                ) :
                                                                React.createElement(
                                                                    'span', { class: 'plgcln-author' },
                                                                    plugin.author
                                                                )
                                                        ),
                                                        !plugin.extension ? null : React.createElement(
                                                            'span', { class: 'plgcln-version' },
                                                            'v' + plugin.version
                                                        )
                                                    ]
                                                )
                                            ]
                                        ),
                                        React.createElement(
                                            'div', { class: 'plgcln-controls' },
                                            [
                                                (!isPartial) ? null
                                                    : React.createElement(
                                                        'div', { class: 'plgcln-controls' },
                                                        [
                                                            !isPartial ? null
                                                                : React.createElement(
                                                                    'button',
                                                                    {
                                                                        class: `plgcln-addon-button secondary`,
                                                                        onClick: function (e) {
                                                                            let asTrusted = TrustedPlugins?.find?.(t => t.name == plugin.name)
                                                                            let menuinvites = [
                                                                                {
                                                                                    disabled: !plugin.invite,
                                                                                    label: `${plugin.name} support server`,
                                                                                    subtext: plugin.invite ? '' : 'Not presented',
                                                                                    action: () => {
                                                                                        window.open('discord://-/invite/' + plugin.invite.match(/\w+$/));
                                                                                        PluginThis.closeSettingsPanel();
                                                                                    }
                                                                                },
                                                                                {
                                                                                    disabled: !asTrusted,
                                                                                    color: 'danger',
                                                                                    label: 'BetterDiscord server',
                                                                                    subtext: asTrusted ? `If nothing worked, ask here what happened to the ${plugin.name}.` : `${plugin.name} is not supported by BD.`,
                                                                                    action: () => {
                                                                                        window.open('discord://-/invite/0Tmfo5ZbORCRqbAd');
                                                                                        PluginThis.closeSettingsPanel();
                                                                                    }
                                                                                },
                                                                            ]
                                                                            ContextMenu.open(e,
                                                                                ContextMenu.buildMenu(
                                                                                    [
                                                                                        {
                                                                                            disabled: PendingFix.includes(plugin.name),
                                                                                            color: 'brand',
                                                                                            label: 'Automaticaly',
                                                                                            subtext: PendingFix.includes(plugin.name) ? 'Pending' : '',
                                                                                            action: () => {
                                                                                                fixplugin(plugin);
                                                                                                Listen.LIST.forceUpdate();
                                                                                            }
                                                                                        },
                                                                                        {
                                                                                            disabled: !(plugin.source ?? plugin.updateUrl),
                                                                                            label: 'Manualy',
                                                                                            subtext: '' ?? 'Source link isn\'t provided.',
                                                                                            action: () => {
                                                                                                window.open(plugin.source ?? plugin.updateUrl);
                                                                                            }
                                                                                        },
                                                                                        { type: 'separator' },
                                                                                        {
                                                                                            label: 'Status spreadsheet',
                                                                                            action: () => {
                                                                                                window.open('https://docs.google.com/spreadsheets/d/e/2PACX-1vTMP7QB-zeyalqAcYF-yOThW1D4bE_rhfUpQ1hKMkNvmto68COWTi0d6F3RsNGisiwvlORITQ9FFaOg/pubhtml?gid=201558878&single=false');
                                                                                            }
                                                                                        },
                                                                                        {
                                                                                            type: 'submenu',
                                                                                            label: 'Support servers',
                                                                                            items: menuinvites
                                                                                        },
                                                                                    ]
                                                                                )
                                                                            );
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
                                                                )
                                                        ]
                                                    ),
                                                React.createElement(
                                                    'div', { class: 'plgcln-controls' },
                                                    [
                                                        !document.getElementById(`${plugin.name}-card`)
                                                            ? null : React.createElement(
                                                                'button',
                                                                {
                                                                    class: `plgcln-addon-button`,
                                                                    onClick: async (e) => {
                                                                        let card = document.getElementById(`${plugin.name}-card`)
                                                                        if (!card) return;
                                                                        PluginThis.closeSettingsPanel()
                                                                        card.scrollIntoView({ behavior: 'smooth', block: 'center' })
                                                                        card.animate([{}, { transform: 'scale(1.1)' }, {}], { duration: 500 })
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
                                                                class: `plgcln-addon-button`,
                                                                onClick: (e) => {
                                                                    electron.shell.showItemInFolder(path.join(Plugins.folder, plugin.filename))
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
                                                    'div', { class: 'plgcln-controls' },
                                                    [
                                                        React.createElement(
                                                            'button',
                                                            {
                                                                class: `plgcln-addon-button danger`,
                                                                onClick: (e) => {
                                                                    BdApi.UI.showConfirmationModal('Delete the file?', `${plugin.filename} will be deleted.`, {
                                                                        danger: true,
                                                                        onConfirm() {
                                                                            try {
                                                                                fs.rmSync(path.join(Plugins.folder, plugin.filename))
                                                                                BdApi.showToast(`${plugin.filename} have been deleted.`, { type: 'warn' })
                                                                            } catch {
                                                                                BdApi.showToast(`Removing the ${plugin.filename} failed.`, { type: 'error' })
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
                                    ]
                                ),
                                isTrusted && !isUnused ? null : React.createElement(
                                    'div',
                                    { class: 'plgcln-description-wrap' },
                                    [
                                        React.createElement(
                                            'div',
                                            { class: 'plgcln-description' },
                                            [
                                                React.createElement(
                                                    'div', { style: {} },
                                                    (plugin.reasons.normal).map(text => !text ? text : Markdown.markdownToReact(text))
                                                ),
                                                React.createElement(
                                                    'div', { style: { color: dangerColors.warning } },
                                                    (plugin.reasons.warning).map(text => !text ? text : Markdown.markdownToReact(text))
                                                ),
                                                React.createElement(
                                                    'div', { style: { color: dangerColors.danger } },
                                                    (plugin.reasons.danger).map(text => !text ? text : Markdown.markdownToReact(text))
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
                            'div', { class: `plgcln-category-header` },
                            [
                                React.createElement('div', { class: 'plgcln-text' }, 'Distrusted plugins: ' + (DistrustedPlugins?.length ?? 0) + (!TrustedPlugins ? ' - Please wait...' : '')),
                            ]
                        ),
                        !DistrustedPlugins ? null : React.createElement(
                            'div',
                            {
                                id: 'plgcln-plugins-container',
                                class: `plgcln-addon-list`,
                                style: { "margin-top": "10px" }
                            },
                            DistrustedPlugins.map(builder)
                        ),
                        React.createElement(
                            'div', { class: `plgcln-category-header` },
                            [
                                React.createElement('div', { class: 'plgcln-text' }, 'Broken plugins: ' + (BrokenPlugins?.length ?? 0)),
                                React.createElement(
                                    Button,
                                    {
                                        color: Button.Colors.BRAND,
                                        disabled: !BrokenPlugins?.length || BrokenPlugins?.every?.(broken => PendingFix.includes(broken.name)),
                                        size: Button.Sizes.SMALL,
                                        onClick: async (e) => {
                                            BrokenPlugins.forEach(broken => fixplugin(broken))
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
                                id: 'plgcln-plugins-container',
                                class: `plgcln-addon-list`,
                                style: { "margin-top": "10px" }
                            },
                            BrokenPlugins.map(builder)
                        ),
                        React.createElement(
                            'div', { class: `plgcln-category-header` },
                            [
                                React.createElement('div', { class: 'plgcln-text' }, 'Unused files: ' + (UnusedFiles?.length ?? 0)),
                            ]
                        ),
                        !UnusedFiles ? null : React.createElement(
                            'div',
                            {
                                id: 'plgcln-plugins-container',
                                class: `plgcln-addon-list`,
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
                // React.createElement(
                //     SettingSwitcher,
                //     {
                //         value: _,
                //         onSwitch: () => {
                //             _ = !_
                //             Listen.LIST.forceUpdate()
                //             return _
                //         }
                //     },
                //     'Experimental plugin fixer.'
                // ),
                React.createElement(ListOf),
            ]
        }
    }
    return new Plugin
}