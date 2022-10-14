/**
 * @name TrustList
 * @version 1.0.0
 * @description Checks if you have untrusted BD plugins.
 * @author Mops
 * @invite PWtAHjBXtG
 * @authorLink https://github.com/Mopsgamer/
 * @authorId 538010208023347200
 * @website https://github.com/Mopsgamer/BetterDiscord-codes/tree/TrustList
 * @source https://raw.githubusercontent.com/Mopsgamer/BetterDiscord-codes/TrustList/TrustList.plugin.js
 * @updateUrl https://raw.githubusercontent.com/Mopsgamer/BetterDiscord-codes/TrustList/TrustList.plugin.js
 */

 module.exports = (meta) => {
    let path = require('path'), fs = require('fs'), electron = require('electron')
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

    let Listen = {}

    // CACHE

    /** Variable to track plugin list changes.
     * @type {BDPluginData[] | undefined}*/
    let CachePlugins;
    /** @type {BDPluginData[] | undefined}*/
    let UntrustedPlugins;
    /** @type {BDPluginData[] | undefined}*/
    let TrustedPlugins;
    
    /**@type {Date}*/
    let CheckDate;

    /*Settings*/
    // They will be saved until the plugin is recompiled
    let UncompiledInUntrusted = true
    /*Settings end*/

    let UntrustedPluginsKnown = {
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
                .trustlist-addon-button svg {
                    fill: white;
                    margin: auto;
                }
                .trustlist-addon-button + .trustlist-addon-button {
                    margin-left: 8px;
                }
                .trustlist-addon-button {
                    display: inline-flex;
                    padding: 4px 6px;
                    border-radius: 3px;
                    transition: background-color .17s ease,color .17s ease;
                    background-color: var(--brand-experiment);
                }
                .trustlist-addon-button:hover {
                    background-color: var(--brand-experiment-560);
                }
                .trustlist-addon-button:active {
                    background-color: var(--brand-experiment-600);
                }
                .trustlist-text {
                    color: var(--header-primary);
                    margin: auto;
                }
                .trustlist-addon-card {
                    display: flex;
                    flex-direction: column;
                    margin-bottom: 20px;
                    border-radius: 5px;
                    overflow: hidden;
                    background: var(--background-secondary);
                }
                .trustlist-addon-header {
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
                .trustlist-controls {
                    display: flex;
                    align-items: center;
                }
                .trustlist-icon {
                    margin-right: 8px;
                }
                .trustlist-asidelabel {
                    margin-right: 8px;
                }
                .trustlist-title, .trustlist-name, .trustlist-meta {
                    display: inline;
                    line-height: normal;
                }
                .trustlist-name::after, .trustlist-version::after {
                    display: inline;
                    content: " ";
                }
                .trustlist-title {
                    flex: 1;
                }
                .trustlist-name {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .trustlist-meta, .trustlist-asidelabel {
                    color: var(--channels-default);
                    font-weight: 500;
                }
                .trustlist-description-wrap {
                    flex: 1;
                    padding: 8px 16px 0 16px;
                }
                .trustlist-description {
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

            class Listenable extends React.Component {
                constructor(state) {
                    let as = state.as
                    state.as = undefined
                    super(state)
                    Listen[as] = this
                }
            }

            class UntrustedPluginsList extends Listenable {
                constructor(state) {
                    super(state)
                    this.state = state
                }
                buildList() {
                    {
                        if(!TrustedPlugins) return;
                        UntrustedPlugins = [];
                        CachePlugins = Plugins.getAll();
                        for (let/**@type {BDPluginData}*/ plug of CachePlugins) {
                            if (!UncompiledInUntrusted && plug?.partial) continue;
                            if (!TrustedPlugins.some(tplug => tplug.name == plug.name)) UntrustedPlugins.push(plug)
                        }
                    }
                    if(!UntrustedPlugins?.length ) return [];
                    else return UntrustedPlugins.map(
                        uplug => {

                            const dangerColors = {
                                unknown: 'var(--header-primary)',
                                known: 'var(--status-warning-background)',
                                danger: 'var(--status-danger-background)',
                            };
                            let reasonsDanger = UntrustedPluginsDanger?.[Object.keys(UntrustedPluginsDanger).find(name => uplug.name.includes(name))];
                            if(reasonsDanger) reasonsDanger = [...reasonsDanger] // reasonsDanger is not the original of UntrustedPluginsDanger[...]
                            let reasonsDetected = [];
                            if (uplug.name != meta.name && uplug?.instance) {
                                let filecontent = fs.readFileSync(path.join(Plugins.folder, uplug.filename))
                                if (/[^\w]getToken[^\w]/.test(filecontent)) reasonsDetected.push(' •  The plugin code probably has direct access to your token.')
                            }
                            (() => { let reasonsKnown = UntrustedPluginsKnown?.[Object.keys(UntrustedPluginsKnown).find(name => uplug.name.includes(name))]; if(reasonsKnown != null) reasonsDetected = reasonsDetected.concat(reasonsKnown) })()
                            if (reasonsDanger) reasonsDanger.push(' •  **Discord can ban you for that.** (You have nothing to fear if you haven\'t used it)')

                            const dangerColorCalc = reasonsDanger?.length ? dangerColors.danger : (reasonsDetected?.length ? dangerColors.known : dangerColors.unknown)

                            let uncompiled = uplug.partial
                            return React.createElement(
                                'div',
                                { class: 'trustlist-addon-card' },
                                [
                                    React.createElement(
                                        'div',
                                        { class: 'trustlist-addon-header' },
                                        [
                                            React.createElement(
                                                'svg',
                                                {
                                                    class: 'trustlist-icon',
                                                    viewBox: '0 0 24 24',
                                                    style: {
                                                        fill: dangerColorCalc,
                                                        width: '18px', height: '18px'
                                                    }
                                                },
                                                React.createElement('path', { d: 'M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7 1.49 0 2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11z' })
                                            ),
                                            React.createElement(
                                                'div', { class: 'trustlist-title' },
                                                [
                                                    React.createElement(
                                                        'div', { class: 'trustlist-name', style: { color: dangerColorCalc } },
                                                        uplug.name
                                                    ),
                                                    React.createElement(
                                                        'div', { class: 'trustlist-meta' },
                                                        [
                                                            React.createElement(
                                                                'span', { class: 'trustlist-version' },
                                                                'v' + uplug.version
                                                            ),
                                                            'by ',
                                                            React.createElement(
                                                                'a', { class: 'trustlist-link trustlist-link-website', href: uplug.authorLink, target: '_blank', rel: 'noopener noreferrer' },
                                                                uplug.author
                                                            )
                                                        ]
                                                    )
                                                ]
                                            ),
                                            React.createElement(
                                                'div', { class: 'trustlist-controls' },
                                                [
                                                    !uncompiled?null:React.createElement(
                                                        'span', { class: 'trustlist-asidelabel' },
                                                        'Broken'
                                                    ),
                                                    document.getElementById(`${uplug.name}-card`)
                                                        ? React.createElement(
                                                            'button',
                                                            {
                                                                class: `trustlist-addon-button`,
                                                                onClick: async (e) => {
                                                                    let card = document.getElementById(`${uplug.name}-card`)
                                                                    if (!card) return;
                                                                    PluginThis.closeSettings()
                                                                    await PluginThis.wait(500)
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
                                                        ) : null,
                                                    React.createElement(
                                                        'button',
                                                        {
                                                            class: `trustlist-addon-button`,
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
                                            )
                                        ]
                                    ),
                                    React.createElement(
                                        'div',
                                        { class: 'trustlist-description-wrap' },
                                        [
                                            React.createElement(
                                                'div',
                                                { class: 'trustlist-description' },
                                                [
                                                    React.createElement(
                                                        'div', { style: {} },
                                                        ([
                                                            ' •  Not listed in the [official BetterDiscord plugin list](https://betterdiscord.app/plugins) [' + CheckDate.toLocaleString() + '].'
                                                        ]).map(text => Markdown.markdownToReact(text))
                                                    ),
                                                    React.createElement(
                                                        'div', { style: { color: dangerColors.known } },
                                                        (reasonsDetected ?? []).map(text => Markdown.markdownToReact(text))
                                                    ),
                                                    React.createElement(
                                                        'div', { style: { color: dangerColors.danger } },
                                                        (reasonsDanger ?? []).map(text => Markdown.markdownToReact(text))
                                                    ),
                                                ]
                                            )
                                        ]
                                    )
                                ]
                            )
                        }
                    )
                }
                render() {
                    let list = this.buildList()
                    Listen.LABEL.forceUpdate()
                    return [
                        React.createElement(
                            'div',
                            {
                                id: 'trustlist-plugins-container',
                                class: `trustlist-addon-list`,
                                style: { "margin-top": "10px" }
                            },
                            TrustedPlugins && list.length ? list : []
                        )
                        ]
                }
            }

            class LabelUntrusted extends Listenable {
                constructor() {
                    super({as: 'LABEL'})
                }
                render() {
                    return TrustedPlugins ?
                        UntrustedPlugins.length ?
                            React.createElement('div', { class: `trustlist-text` },
                                'Untrusted plugins detected - ' + UntrustedPlugins.length
                            ) :
                            React.createElement('div', { class: `trustlist-text` },
                                'No untrusted plugins have been found'
                            ) : []
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

            class CheckButton extends React.Component {
                constructor(state) {
                    super(state)
                    this.state = state
                }
                render() {
                    return React.createElement(Button, {
                        color: this.state?.color ?? Button.Colors.BRAND,
                        disabled: this.state?.disabled ?? false,
                        onClick: async () => {
                            this.setState({ label: 'Fetching the trust list...', disabled: true })
                            require('request').get('https://api.betterdiscord.app/v1/store/addons',
                                (error, r, body) => {
                                    if (error) {
                                        console.error('TrustList error: failed to fetch.')
                                        this.setState({ label: 'Failed to fecth trust list (Click to try again)', color: Button.Colors.RED, disabled: false })
                                    }
                                    if (error) return;
                                    this.setState({ label: 'Processing plugins...', disabled: true })
                                    TrustedPlugins = JSON.parse(body)
                                    CheckDate = new Date()
                                    Listen.LIST.forceUpdate()
                                    this.setState({ label: 'Fetch the list again', disabled: false })
                                }
                            )
                        }
                    },
                        this.state?.label ?? this.props?.children ?? ''
                    )
                }
            }
    
            return [
                React.createElement(
                    SettingSwitcher,
                    {
                        value: UncompiledInUntrusted,
                        onSwitch: (pluginthis, compthis) => {
                            UncompiledInUntrusted = !UncompiledInUntrusted
                            Listen.LIST.forceUpdate()
                            return UncompiledInUntrusted
                        }
                    },
                    'Uncompiled plugins'
                ),
                React.createElement(
                    'div', { class: `${Margin.marginBottom8}`, style: {display: 'flex', flexDirection: 'row'} },
                    [
                        UntrustedPlugins == void 0
                            ? React.createElement(CheckButton, null, 'Check for untrusted')
                            : React.createElement(CheckButton, null, 'Fetch the list again'),
                        React.createElement(LabelUntrusted)
                    ]
                ),
                React.createElement(UntrustedPluginsList, { as: 'LIST' }),
            ]
        }
    }
    return new Plugin
}