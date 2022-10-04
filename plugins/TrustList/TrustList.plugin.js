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
    const { Webpack, React, Plugins } = BdApi

    /**
     * @typedef {object} BDPluginData
     * @property {string} author
     * @property {string} authorId
     * @property {string} authorLink
     * @property {string} name
     * @property {string} filename
     * @property {string} version
     * @property {string} source
     * @property {string} website
     * @property {number} size
     */
    /** @type {BDPluginData[] | undefined}*/
    let UntrustedPlugins;
    /** @type {BDPluginData[] | undefined}*/
    let TrustedPlugins;
    /** @type {BDPluginData[] | undefined}*/
    let CompiledPlugins;
    /** @type {BDPluginData[] | undefined}*/
    let UncompiledPlugins;
    
    /**@type {Date}*/
    let CheckDate;

    /*Settings*/
    // They will be saved until the plugin is recompiled
    let IncludeUncompiledInUntrusted = true
    /*Settings end*/

    let UntrustedPluginsKnown = {
        'XenoLib': ['• Is used by MessageLogger.'],
        'MessageLogger': ['• **Violates the 3-rd & 4-th condition** of [Security & Privacy](https://docs.betterdiscord.app/plugins/introduction/guidelines#security--privacy).'],
        'AnimatedStatus': ['• **Violates the 3-rd condition** of [Security & Privacy](https://docs.betterdiscord.app/plugins/introduction/guidelines#security--privacy).'],
        'Animated_Status': ['• **Violates the 3-rd condition** of [Security & Privacy](https://docs.betterdiscord.app/plugins/introduction/guidelines#security--privacy).'],
        'PremiumScreenShare': ['• **Violates the 3-rd condition** of [Security & Privacy](https://docs.betterdiscord.app/plugins/introduction/guidelines#security--privacy).'],
        'HiddenChannels': ['• **Violates the 4-th condition** of [Security & Privacy](https://docs.betterdiscord.app/plugins/introduction/guidelines#security--privacy).'],
    }

    let FindedModules = {
        //components
        Button: Webpack.getModule(Webpack.Filters.byProps('BorderColors')),
        SwitchRow: Webpack.getModule(m => m.toString().includes("helpdeskArticleId")),
        Markdown: Webpack.getModule(Webpack.Filters.byProps("parseBlock", "parseInline", "defaultOutput")),

        //classes
        Margin: Webpack.getModule(Webpack.Filters.byProps('marginBottom20')),
        Title: Webpack.getModule(Webpack.Filters.byProps('title', 'subtitle')),
    }

    class Plugin {

        start() {
            
        }
    
        stop() {
            this.closeSettings()
        }

        wait(ms) {
            return new Promise(rs=>setTimeout(rs, ms))
        }

        closeSettings() {
            document.querySelector('.bd-addon-modal-footer > .bd-button')?.click?.()
        }

        extractMeta(fileContent, filename) {
            const firstLine = fileContent.split("\n")[0];
            const hasOldMeta = firstLine.includes("//META") && firstLine.includes("*//");
            if (hasOldMeta) return this.parseOldMeta(fileContent, filename);
            const hasNewMeta = firstLine.includes("/**");
            if (hasNewMeta) return this.parseNewMeta(fileContent);
            return {}
        }
    
        parseOldMeta(fileContent) {
            const meta = fileContent.split("\n")[0];
            const metaData = meta.substring(meta.lastIndexOf("//META") + 6, meta.lastIndexOf("*//"));
            try {
                return JSON.parse(metaData);
            } catch {
                return {};
            }
        }
    
        parseNewMeta(fileContent) {
            const block = fileContent.split("/**", 2)[1].split("*/", 1)[0];
            const out = {};
            let field = "";
            let accum = "";
            for (const line of block.split(/[^\S\r\n]*?\r?(?:\r\n|\n)[^\S\r\n]*?\*[^\S\r\n]?/)) {
                if (line.length === 0) continue;
                if (line.charAt(0) === "@" && line.charAt(1) !== " ") {
                    out[field] = accum.trim();
                    const l = line.indexOf(" ");
                    field = line.substring(1, l);
                    accum = line.substring(l + 1);
                }
                else {
                    accum += " " + line.replace("\\n", "\n").replace(/^\\@/, "@");
                }
            }
            out[field] = accum.trim();
            delete out[""];
            return out;
        }

        resplitPlugins() {
            if(!TrustedPlugins) return;
            CompiledPlugins = Plugins.getAll()
            ;{// UncompiledPlugins
                let isFile = (path) => {
                    try {
                        if (fs?.accessSync && isFinite(fs?.constants?.F_OK))
                            fs.accessSync(path, fs.constants.F_OK)
                        else return true// bad filesystem - no matter file or dir
                        return true
                    } catch { return false }
                }
                UncompiledPlugins = fs.readdirSync(Plugins.folder)
                .filter(
                    // only .plugin.js files, no folders .plugin.js
                    fname => fname.endsWith('.plugin.js') && isFile(path.join(Plugins.folder, fname))
                )
                .map(
                    // plugin_file_name to BDPluginData
                    pfname => ({ ...this.extractMeta(fs.readFileSync(path.join(Plugins.folder, pfname))), filename: pfname })
                ).filter(
                    // only if not stored in CompiledPlugins
                    (/**@type {BDPluginData}*/bplug) => !CompiledPlugins.find(cplug => cplug.name == bplug.name)
                )
            };
            UntrustedPlugins = CompiledPlugins
            if (IncludeUncompiledInUntrusted) UntrustedPlugins = UntrustedPlugins.concat(UncompiledPlugins)
            UntrustedPlugins = UntrustedPlugins.filter(uplug => !TrustedPlugins.some(tplug => tplug.name == uplug.name))
        }
    
        getSettingsPanel = () => {
            let PluginThis = this

            const { Button, Markdown, SwitchRow, Margin, Title } = FindedModules;

            let Listen = {}
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
                    PluginThis.resplitPlugins()
                    if(!UntrustedPlugins?.length ) return [];
                    else return UntrustedPlugins.map(
                        uplug => {
                            let knownName = Object.keys(UntrustedPluginsKnown).find(name => uplug.name.includes(name));
                            let uncompiled = UncompiledPlugins ? UncompiledPlugins.some(bplug => bplug.name == uplug.name) : false;
                            return React.createElement(
                                'div',
                                { class: 'bd-addon-card' },
                                [
                                    React.createElement(
                                        'div',
                                        { class: 'bd-addon-header' },
                                        [
                                            React.createElement(
                                                'svg', {
                                                class: 'bd-icon',
                                                viewBox: '0 0 24 24',
                                                style: {
                                                    fill: knownName ? 'var(--button-danger-background)' : 'var(--header-primary)',
                                                    width: '18px', height: '18px'
                                                }
                                            },
                                                React.createElement('path', {
                                                    d: uncompiled
                                                        ? 'M 20.5 11 H 19 V 7 c 0 -1.1 -0.9 -2 -2 -2 L 15 9 L 17 10 L 12 15 L 14 11 L 11 10 L 13 5 h 0 V 3.5 C 13 2.12 11.88 1 10.5 1 S 8 2.12 8 3.5 V 5 H 4 c -1.1 0 -1.99 0.9 -1.99 2 v 3.8 H 3.5 c 1.49 0 2.7 1.21 2.7 2.7 s -1.21 2.7 -2.7 2.7 H 2 V 20 c 0 1.1 0.9 2 2 2 h 3.8 v -1.5 c 0 -1.49 1.21 -2.7 2.7 -2.7 c 1.49 0 2.7 1.21 2.7 2.7 V 22 H 17 c 1.1 0 2 -0.9 2 -2 v -4 h 1.5 c 1.38 0 2.5 -1.12 2.5 -2.5 S 21.88 11 20.5 11 z'
                                                        : 'M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7 1.49 0 2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11z'
                                                })
                                            ),
                                            React.createElement(
                                                'div', { class: 'bd-title' },
                                                [
                                                    React.createElement(
                                                        'div', { class: 'bd-name' },
                                                        uplug.name
                                                    ),
                                                    React.createElement(
                                                        'div', { class: 'bd-meta' },
                                                        [
                                                            React.createElement(
                                                                'span', { class: 'bd-version' },
                                                                'v' + uplug.version
                                                            ),
                                                            'by ',
                                                            React.createElement(
                                                                'a', { class: 'bd-link bd-link-website', href: uplug.authorLink, target: '_blank', rel: 'noopener noreferrer' },
                                                                uplug.author
                                                            )
                                                        ]
                                                    )
                                                ]
                                            ),
                                            !uncompiled?null:React.createElement(
                                                'div', { style: { color: 'var(--channels-default)', 'margin-right': '5px' } },
                                                'Uncompiled'
                                            ),
                                            React.createElement(
                                                'div', { class: 'bd-controls' },
                                                React.createElement(
                                                    'button',
                                                    {
                                                        class: `bd-button bd-addon-button`,
                                                        onClick: uncompiled
                                                            ? (e) => {
                                                                electron.shell.showItemInFolder(path.join(Plugins.folder, uplug.filename))
                                                            } : async (e) => {
                                                                let card = document.getElementById(`${uplug.name}-card`)
                                                                if (!card) return;
                                                                PluginThis.closeSettings()
                                                                await PluginThis.wait(500)
                                                                card.scrollIntoView({ behavior: 'smooth', block: 'center' })
                                                                card.animate(
                                                                    [
                                                                        {},
                                                                        { transform: 'scale(1.1)' },
                                                                        {}
                                                                    ],
                                                                    {
                                                                        duration: 500,
                                                                        easing: 'linear'
                                                                    }
                                                                )
                                                            }
                                                    },
                                                    uncompiled?'SHOW IN FOLDER':'SHOW'
                                                )
                                            )
                                        ]
                                    ),
                                    React.createElement(
                                        'div',
                                        { class: 'bd-description-wrap' },
                                        React.createElement(
                                            'div',
                                            { class: 'bd-description' },
                                            [
                                                Markdown.markdownToReact(
                                                    '• Not listed in the [official BetterDiscord plugin list](https://betterdiscord.app/plugins) [' + CheckDate.toLocaleString() + '].'
                                                ),
                                                React.createElement(
                                                    'div', {style: {color: 'var(--text-danger)'}},
                                                    (UntrustedPluginsKnown[knownName] ?? []).map(text => Markdown.markdownToReact(text))
                                                ),
                                            ]
                                        )
                                    )
                                ]
                            )
                        }
                    )
                }
                render() {
                    let list = this.buildList()
                    return React.createElement(
                        'div',
                        {
                            id: 'untrusted-plugins-container',
                            class: 'bd-addon-list',
                            style: { "margin-top": "10px" }
                        },
                        TrustedPlugins ?
                            list.length ? [
                                React.createElement('div', { class: `bd-settings-title`, style: { 'margin-bottom': '8px' } },
                                    'Untrusted plugins detected - ' + UntrustedPlugins.length
                                ),
                                list
                            ] : [
                                React.createElement('div', { class: `bd-settings-title`, style: { 'margin-bottom': '8px' } },
                                    'No untrusted plugins have been found'
                                )
                            ] : []
                    )
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
                    }, this.state?.label ?? this.props?.children ?? '')
                }
            }
    
            return [
                React.createElement(
                    SettingSwitcher,
                    {
                        value: IncludeUncompiledInUntrusted,
                        onSwitch: (pluginthis, compthis) => {
                            IncludeUncompiledInUntrusted = !IncludeUncompiledInUntrusted
                            Listen.LIST.forceUpdate()
                            return IncludeUncompiledInUntrusted
                        }
                    },
                    'Include uncompiled plugins'
                ),
                React.createElement(
                    'div', { class: `${Margin.marginBottom8}` },
                    UntrustedPlugins == void 0
                        ? React.createElement(CheckButton, null, 'Check for untrusted')
                        : React.createElement(CheckButton, null, 'Fetch the list again')
                ),
                React.createElement(UntrustedPluginsList, { as: 'LIST' }),
            ]
        }
    }
    return new Plugin
}