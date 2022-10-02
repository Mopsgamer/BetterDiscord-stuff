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
    let path = require('path'), fs = require('fs')

    /**
     * @typedef {object} BDPluginData
     * @property {string} author
     * @property {string} authorId
     * @property {string} name
     * @property {string} id
     * @property {string} slug
     * @property {string} filename
     * @property {string} source
     * @property {string} version
     * @property {string} website
     * @property {number} size
     * @property {number} added
     * @property {number} modified
     * @property {Plugin} exports
     */
    /**
    * @type {BDPluginData[]}
    */
    let UntrustedPlugins
    /**
    * @type {BDPluginData[]}
    */
    let AllPlugins;
    /**@type {Date}*/
    let CheckDate;
    let UntrustedPluginsKnown = {
        'XenoLib': 'Is used by MessageLogger.',
        'MessageLogger': '**Violates the 3-rd & 4-th condition** of [Security & Privacy](https://docs.betterdiscord.app/plugins/introduction/guidelines#security--privacy).',
        'AnimatedStatus': '**Violates the 3-rd condition** of [Security & Privacy](https://docs.betterdiscord.app/plugins/introduction/guidelines#security--privacy).',
        'Animated_Status': '**Violates the 3-rd condition** of [Security & Privacy](https://docs.betterdiscord.app/plugins/introduction/guidelines#security--privacy).',
        'Nitro': '**Violates the 3-rd condition** of [Security & Privacy](https://docs.betterdiscord.app/plugins/introduction/guidelines#security--privacy).',
        'HiddenChannels': '**Violates the 4-th condition** of [Security & Privacy](https://docs.betterdiscord.app/plugins/introduction/guidelines#security--privacy).',
    }

    let FindedModules = {
        Button: BdApi.Webpack.getModule(BdApi.Webpack.Filters.byProps('BorderColors')),
        Markdown: BdApi.Webpack.getModule(BdApi.Webpack.Filters.byProps("parseBlock", "parseInline", "defaultOutput")),
        Margin: BdApi.Webpack.getModule(BdApi.Webpack.Filters.byProps('marginBottom20')),
        Title: BdApi.Webpack.getModule(BdApi.Webpack.Filters.byProps('title', 'subtitle'))
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
    
        getSettingsPanel = () => {
            let PluginThis = this
            const { React } = BdApi

            const { Button, Markdown, Margin, Title } = FindedModules;

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
                    if(!UntrustedPlugins?.length ) return [];
                    else return UntrustedPlugins.map(
                        uplug => React.createElement(
                            'div',
                            { class: 'bd-addon-card' },
                            [
                                React.createElement(
                                    'div',
                                    { class: 'bd-addon-header' },
                                    [
                                        React.createElement(
                                            'svg', { class: 'bd-icon', viewBox: '0 0 24 24', style: { fill: Object.keys(UntrustedPluginsKnown).some(name => uplug.name.includes(name)) ? 'var(--button-danger-background)' : 'var(--header-primary)', width: '18px', height: '18px' } },
                                            React.createElement('path', { d: 'M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7 1.49 0 2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11z' })
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
                                                            'a', { class: 'bd-link bd-link-website', target: '_blank' },
                                                            uplug.author
                                                        )
                                                    ]
                                                )
                                            ]
                                        ),
                                        React.createElement(
                                            'div', { class: 'bd-controls' },
                                            [
                                                React.createElement(
                                                    'button',
                                                    {
                                                        class: 'bd-button bd-addon-button',
                                                        onClick: async (e) => {
                                                            PluginThis.closeSettings()
                                                            let card = document.getElementById(`${uplug.name}-card`)
                                                            await PluginThis.wait(500)
                                                            card.scrollIntoView({ behavior: 'smooth', block: 'center' })
                                                            card.animate(
                                                                [
                                                                    {},
                                                                    { transform: 'scale(1.1)', },
                                                                    {}
                                                                ],
                                                                {
                                                                    duration: 500,
                                                                    easing: 'linear'
                                                                }
                                                            )
                                                        }
                                                    },
                                                    'Show'
                                                )
                                            ]
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
                                                '**Not listed** in the [official BetterDiscord plugin list](https://betterdiscord.app/plugins).'
                                            ),
                                            Markdown.markdownToReact(
                                                (UntrustedPluginsKnown[Object.keys(UntrustedPluginsKnown).find(name => uplug.name.includes(name))] ?? '')
                                            )
                                        ]
                                    )
                                )
                            ]
                        )
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
                            list.length?[
                                React.createElement('div', { class: `bd-settings-title`, style: { 'margin-bottom': '8px' } },
                                    'Untrusted plugins (' + UntrustedPlugins.length + '/' + AllPlugins.length + ')'
                                ),
                                React.createElement('div', { class: `bd-description` },
                                    'List as of ' + CheckDate.toLocaleString()
                                ),
                                list
                            ]:list
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
    
                            this.setState({ label: 'Fetching trust list...', disabled: true })
                            require('request').get('https://api.betterdiscord.app/v1/store/addons',
                                (error, r, body) => {
                                    if (error) {
                                        console.error('TrustList error: failed to fetch.')
                                        this.setState({ label: 'Failed to fecth trust list (Click to check again)', color: Button.Colors.RED, disabled: false })
                                    }
                                    if (error) return;
                                    this.setState({ label: 'Processing plugins...', disabled: true })
                                    let TrustedPlugins = JSON.parse(body)
                                    AllPlugins = BdApi.Plugins.getAll()
    
                                    UntrustedPlugins = AllPlugins.filter(uplug => !TrustedPlugins.some(tplug => tplug.name == uplug.name))
                                    CheckDate = new Date()
                                    Listen.LIST.forceUpdate()
                                    this.setState({ disabled: false })
                                    if (UntrustedPlugins.length > 0) this.setState({ label: 'Untrusted plugins detected (Click to check again)', color: Button.Colors.RED })
                                    else this.setState({ label: 'All plugins are trusted (Click to check again)', color: Button.Colors.GREEN })
                                }
                            )
    
                        }
                    }, this.state?.label ?? this.props?.children ?? '')
                }
            }

            let button;
            if (UntrustedPlugins == void 0) button = React.createElement(CheckButton, null, 'Check for untrusted')
            else
                if (UntrustedPlugins.length > 0) button = React.createElement(CheckButton, { color: Button.Colors.RED }, 'Untrusted plugins detected (Click to check again)')
                else button = React.createElement(CheckButton, { color: Button.Colors.GREEN }, 'All plugins are trusted (Click to check again)')
    
            return [
                button,
                React.createElement(UntrustedPluginsList, {as: 'LIST'})
            ]
        }
    }
    return new Plugin
}