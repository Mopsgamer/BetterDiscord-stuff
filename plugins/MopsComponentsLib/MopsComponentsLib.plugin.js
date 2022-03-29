/**
 * @name MopsComponentsLib
 * @version 0.0.5
 * @description Library of components.
 * @author Mops
 * @authorLink https://github.com/Mopsgamer/
 * @authorId 538010208023347200
 * @website https://github.com/Mopsgamer/BetterDiscord-codes/tree/MopsComponentsLib
 * @source https://raw.githubusercontent.com/Mopsgamer/BetterDiscord-codes/MopsComponentsLib/MopsComponentsLib.plugin.js
 * @updateUrl https://raw.githubusercontent.com/Mopsgamer/BetterDiscord-codes/MopsComponentsLib/MopsComponentsLib.plugin.js
 */

module.exports = class MopsComponentsLib {

    static modules = {
        ScrollbarDefault: BdApi.findModuleByProps('scrollbarDefault')?.scrollbarDefault,
    }

    static modules = {
        markdown: BdApi.findModule(m => m.displayName == "Markdown" && m.rules)
    }

    getName() { return 'MopsComponentsLib'; }
    getAuthor() { return ['Mops'].map(a => a.name).join(', '); }
    getDescription() { return 'Library of components.'; }
    getVersion() { return '0.0.5'; }

    load() {

        const {React, ReactDOM} = BdApi

        BdApi.Plugins.enable(this.getName());

        var testButton = async () => {
            await new Promise(rs=>setTimeout(rs, 0))

            var settingsButton = document.createElement('button')
            settingsButton.classList.add('bd-button', 'bd-addon-button', 'MCL_view')
            ReactDOM.render(React.createElement(this.lib.obj.Svg, {...this.lib.obj.Svg.Temps.Other.eye, size: '20px'}), settingsButton)
            var controls = document.querySelector(`#${this.getName()}-card > .bd-footer > .bd-controls`)
            if(controls) var buttonOld = controls.querySelector(`.MCL_view`) 
            if(buttonOld) buttonOld.remove();
            if(controls) controls.prepend(settingsButton);
                        
            settingsButton.addEventListener('click', (e) => this.lib.obj.testModal())
        }

        document.addEventListener('click', ()=>testButton())

        testButton()
    }

    start() {

        global.MopsComponentsLib = this.lib.obj

        BdApi.injectCSS
        (this.getName(), this.lib.css)
    }

    stop() {
        delete global.MopsComponentsLib;
        BdApi.clearCSS('MopsComponentsLib');
        document.removeEventListener('click', ()=>testButton())
    }

    get lib() {
        const {React, showConfirmationModal} = BdApi

        var mcl = {
            version: this.getVersion()
        }

        mcl.Divider = class MCL_Divider extends React.Component {

            constructor() {
                super()
            }

            render() {

                return React.createElement('div',
                    {
                        class: 'MCL_Divider'
                    }
                )
            }
        }

        mcl.Text = class MCL_Text extends React.Component {

            /**
             * @typedef {Object} MCL_TextOptions
             * @property {string} [id='']
             * @property {string} [class='']
             * @property {string} [link?]
             * @property {string} [content='Text']
             */

            /**
             * @param {MCL_TextOptions} state 
             */

            constructor(state) {
                super(state)
                this.state = state
            }

            render() {

                var text = this.state;

                return React.createElement('span',
                    {
                        id: text.id ?? '',
                        class: `MCL_Text ${text.link ? 'link' : ''}`,
                        onClick: (e) => {
                            if(typeof text.link == 'string') window.open(text.link)
                        }
                    },
                    text.content ?? 'Text'
                )
            }
        }

        mcl.Markdown = class MCL_Markdown extends React.Component {

            /**
             * @typedef {Object} MCL_MarkdownOptions
             * @property {string} [content='']
             */

            /**
             * @param {MCL_MarkdownOptions} state 
             */
            constructor(state) {
                super(state)
                this.state = state
            }


            render() {
                return React.createElement(MopsComponentsLib.modules.markdown, this.state, this.state.content ?? '')
            }

        }

        mcl.Svg = class MCL_Svg extends React.Component {

            /**
             * @typedef {Object} MCL_SvgOptions
             * @property {string} [id='']
             * @property {string} [class='']
             * @property {string} [margin='0']
             * @property {string | 'right' | 'left'} [align=false]
             * @property {string} [viewBox='0 0 24 24']
             * @property {string} [color='#fff']
             * @property {string} [background='none']
             * @property {string} [size='16px']
             */

            /**
             * @param {MCL_SvgOptions} state 
             */

            constructor(state) {
                super(state)
                this.state = state
            }

            static Temps = {
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
                Discord: {
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
                            {fill: '#fff', 'fill-rule': 'evenodd', 'clip-rule': 'evenodd', d: 'M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z'},
                            {tag: 'circle', cx: '12', cy: '12', r: '5'},
                        ],
                        viewBox: '0 0 24 24'
                    },
                    radioUnchecked: {
                        paths: [
                            {'fill-rule': 'evenodd', 'clip-rule': 'evenodd', d: 'M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z'},
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
                    list: {
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

            render() {

                var state = this.state;
                return React.createElement('svg',
                    {
                        viewBox: state.viewBox ?? '0 0 24 24',
                        fill: state.color ?? '#fff',
                        class: state.class ?? '',
                        id: state.id ?? '',
                        style: {
                            background: state.background ?? 'none',
                            width: state.size ?? '16px',
                            height: state.size ?? '16px',
                            position: (['right', 'left']).includes(state.align ?? false) ? 'absolute' : 'relative',
                            right: (state.align == 'right') ? '12px' : 'none',
                            left: (state.align == 'left') ? '12px' : 'none',
                            margin: state.margin ?? '0',
                        }
                    },
                    (state.paths ?? []).map(
                        path => {
                            if(typeof path == 'object') {
                                if(!Array.isArray(path)) return React.createElement(path.tag??'path', path)
                                return React.createElement(path.tag??'path', 'path is array!')
                            } else return React.createElement('path', { d: path })
                        }
                    )
                )
            }
        }

        mcl.Switcher = class MCL_Switcher extends React.Component {

            /**
             * @typedef {Object} MCL_SwitcherOptions
             * @property {string} [id='']
             * @property {string} [class='']
             * @property {string} [margin='8px']
             * @property {'blurple' | 'green' | 'red'} [color='green']
             * @property {boolean} [disabled=false]
             * @property {boolean} [checked=false]
             * @property {(checked: boolean)=>void} [onclick]
             */

            /**
             * @param {MCL_SwitcherOptions} state 
             */

            constructor(state) {
                super(state)
                this.state = state
            }

            render() {

                var switcher = this.state;

                return React.createElement('div', {
                    id: switcher?.id ?? '',
                    class: `MCL_Switcher ${['blurple', 'green', 'red'].includes(switcher?.color) ? switcher.color : 'green'} ${switcher?.disabled ? 'disabled' : ''} ${switcher?.checked ? 'checked': 'unchecked'} ${switcher?.class ?? ''}`,
                    style: {
                        margin: switcher?.margin ?? '8px',
                    },
                    onClick: (e) => {
                        this.setState({checked: !this.state?.checked})
                        if (typeof switcher?.onclick == 'function') switcher.onclick(this.state?.checked)
                    },
                    onMouseDown(e) {
                        var circle = e.currentTarget.querySelector('.MCL_SwitcherCircle')
                        document.addEventListener('mouseup', (e)=>{
                            circle.style.width = ''
                            circle.style.height = ''
                        }, {once: true})
                        circle.style.width = '75%'
                        circle.style.height = '17px'
                    }
                },
                    React.createElement('div',
                        {
                            class: `MCL_SwitcherCircle`,
                        },
                        React.createElement(mcl.Svg,
                            {
                                viewBox: mcl.Svg.Temps.Discord.switcherTick.viewBox,
                                size: '19px',
                                paths: ['', '']
                            }
                        )
                    )
                )
            }
        }

        mcl.Button = class MCL_Button extends React.Component {

            /**
             * @typedef {Object} MCL_ButtonOptions
             * @property {string} [id='']
             * @property {string} [class='']
             * @property {string} [padding='8px']
             * @property {string} [margin='8px']
             * @property {string} [width='fit-content']
             * @property {string} [height='fit-content']
             * @property {'blurple' | 'grey' | 'green' | 'red'} [color='blurple']
             * @property {boolean} [disabled=false]
             * @property {string} [link?]
             * @property {(e: MouseEvent)=>void} [onclick]
             */

            /**
             * @param {MCL_ButtonOptions} state 
             */

            constructor(state) {
                super(state)
                this.state = state
            }

            render() {

                class MCL_ButtonLabel extends React.Component {

                    constructor(props) {
                        super(props)
                        this.label = props?.label ?? ''
                    }

                    render() {
                        return React.createElement('span', {
                            class: `MCL_ButtonLabel`,
                        },
                            this.label
                        )
                    }
                }

                var button = this.state;
                return React.createElement('button', {
                    id: button.id ?? '',
                    class: `MCL_Button ${button.disabled ? 'disabled' : ''} ${(['filled', 'inverted', 'underline']).includes(button.fill) ? button.fill : 'filled'} ${(['blurple', 'grey', 'green', 'red']).includes(button.color) ? button.color : 'blurple'} ${button.class ?? ''}`,
                    style: {
                        width: button.width ?? 'fit-content',
                        height: button.height ?? 'fit-content',
                        padding: button.padding ?? '8px',
                        margin: button.margin ?? '8px',
                        
                    },
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
                            Array.isArray(button.svgs) ? button.svgs.map((svgTemp) => React.createElement(mcl.Svg, {...svgTemp, margin: '0 4px 0 0'})) : null,
                            React.createElement(MCL_ButtonLabel, { label: button.label }),
                            typeof button.link == 'string' ? React.createElement(mcl.Svg, {
                                align: 'right',
                                paths: [
                                    ...mcl.IconPaths.linkArrow
                                ],
                            }) : null
                        ]
                    )
                )
            }
        }

        mcl.Input = class MCL_Input extends React.Component {

            /**
             * @typedef {Object} MCL_InputOptions
             * @property {string} [id='']
             * @property {string} [class='']
             * @property {string} [padding='8px']
             * @property {string} [margin='8px 0']
             * @property {string} [width='100%']
             * @property {string} [height='fit-content']
             * @property {string} [placeholder='']
             * @property {string} [maxlength='']
             * @property {number | ''} [max='']
             * @property {number | ''} [min=0]
             * @property {number | ''} [size='']
             * @property {number | ''} [step=0.01]
             * @property {string | number} [value='']
             * @property {'text' | 'password' | 'email' | 'number' | 'integer'} [type='text']
             * @property {boolean} [disabled=false]
             * @property {(event: MouseEvent)=>void} [onclick]
             * @property {(event: InputEvent, value: string)=>void} [onchange]
             */

            /**
             * @param {MCL_InputOptions} state 
             */

            constructor(state) {
                super(state)
                this.state = state
            }

            render() {
                var input = this.state;
                return React.createElement('input',
                    {
                        placeholder: input.placeholder ?? '',
                        maxlength: input.maxlength ?? '',
                        max: input.max ?? '',
                        min: input.min ?? 0,
                        size: input.size ?? '',
                        step: input.step ?? 0.01,
                        value: input.value ?? '',
                        type: (['text', 'password', 'email', 'number', 'integer']).includes(input.type) ? (input.type == 'integer' ? 'number' : input.type) : 'text',
                        id: input.id ?? '',
                        class: `MCL_Input ${input.disabled ? 'disabled' : ''} ${input.class ?? ''}`,
                        style: {
                            display: 'inline-block',
                            width: input.width ?? '100%',
                            height: input.height ?? 'fit-content',
                            padding: input.padding ?? '8px',
                            margin: input.margin ?? '8px 0',
                        },
                        onClick: input.onclick ?? null,
                        onChange: (e) => {
                            var value = e.currentTarget.value

                            if ((['number', 'integer']).includes(input.type) && !(/\d*,/).test(value)) {
                                value = Number(value)
                                value = (value <= (input.max ?? Infinity) ? value : input.max)
                                value = (value >= (input.min ?? 0) ? value : input.min ?? 0)
                                value = (input.type == 'integer' ? Math.floor(value) : value)
                            }
                            var newValue = String(value)

                            this.setState({
                                ...input,
                                value: newValue
                            })

                            input.onchange?.(e, value)
                        }
                    }
                )
            }
        }

        mcl.Textarea = class MCL_Textarea extends React.Component {

            /**
             * @typedef {Object} MCL_TextareaOptions
             * @property {string} [id='']
             * @property {string} [class='']
             * @property {string} [width='calc(100% - 18px)']
             * @property {string} [height='270px']
             * @property {string} [margin='8px 0']
             * @property {string} [placeholder='']
             * @property {string} [maxlength='']
             * @property {boolean} [disabled=false]
             * @property {(event: MouseEvent)=>void} [onclick]
             * @property {(event: InputEvent, value: string)=>void} [onchange]
             */

            /**
             * @param {MCL_TextareaOptions} state 
             */

            constructor(state) {
                super(state)
                this.state = state
            }

            render() {
                var textarea = this.state;
                return React.createElement('textarea',
                    {
                        spellcheck: 'false',
                        type: textarea?.type ?? 'text',
                        placeholder: textarea?.placeholder ?? '',
                        id: textarea?.id ?? '',
                        class: `MCL_Textarea ${textarea?.disabled ? 'disabled' : ''} ${MopsComponentsLib.modules.ScrollbarDefault} ${textarea?.class ?? ''}`,
                        style: {
                            height: textarea?.height ?? '270px',
                            width: textarea?.width ?? 'calc(100% - 18px)',
                            margin: textarea?.margin ?? '8px 0'
                        },
                        onChange: (e) => {
                            textarea.onchange?.(e, e.currentTarget.value)
                        },
                        onClick: (e) => {
                            textarea.onclick?.(e)
                        }
                    },
                    textarea.value
                )
            }
        }

        mcl.RadioGroup = class MCL_RadioGroup extends React.Component {

            /**
             * @typedef {Object} MCL_RadioOptions
             * @property {string} [name='']
             * @property {string} [note='']
             * @property {'none' | 'green' | 'yellow' | 'red'} [color='none']
             * @property {string} value
             * @property {boolean} [disabled=false]
             */

            /**
             * @typedef {Object} MCL_RadioGroupOptions
             * @property {string} [id='']
             * @property {string} [class='']
             * @property {Array<MCL_RadioOptions>} [radios]
             */

            /**
             * @param {MCL_RadioGroupOptions} state 
             */

            constructor(state) {
                super(state)
                this.state = state
            }

            render() {
                var radiogroup = this.state;
                return React.createElement('div',
                    {
                        class: `MCL_RadioGroup`
                    },
                    radiogroup?.radios?.map?.(
                        radio => radio.value?React.createElement('div',
                            {
                                value: radio.value,
                                class: `MCL_Radio ${radio?.value==radiogroup?.value?'selected':''} ${['none', 'green', 'yellow', 'red'].includes(radio?.color)?radio.color:'none'}`,
                                onClick: (e) => {
                                    var value = e.currentTarget.getAttribute('value')
                                    this.setState({value: value})
                                    if(typeof radiogroup.onchange == 'function') radiogroup.onchange(value)
                                }
                            },
                            [
                                React.createElement(mcl.Svg, { ...mcl.Svg.Temps.Discord.radioChecked, size: '24px', margin: '0 10px 0 0' }),
                                React.createElement(
                                    'div',
                                    { class: 'MCL_RadioInfo' },
                                    [
                                        React.createElement('div', { class: 'MCL_RadioName' }, radio?.name ?? ''),
                                        radio?.note ? React.createElement('div', { class: 'MCL_RadioNote' }, radio?.note) : null
                                    ]
                                )
                            ]
                        ):null
                    )
                )
            }

        }

        mcl.Container = class MCL_Container extends React.Component {

            /**
             * @typedef {Object} MCL_ContainerOptions
             * @property {string} [id='']
             * @property {string} [class='']
             * @property {string} [content='']
             * @property {'notice' | 'primary' | 'tertiary' | 'secondary' | 'secondary-alt'} [type='secondary']
             */

            /**
             * @param {MCL_ContainerOptions} state 
             */

            constructor(state) {
                super(state)
                this.state = state
            }

            render() {

                var container = this.state;
                return React.createElement('div',
                    {
                        id: container?.id ?? '',
                        class: `MCL_Container ${['notice', 'primary', 'tertiary', 'secondary', 'secondary-alt'].includes(container.type)?container.type:'secondary'} ${container?.class ?? ''}`
                    },
                    container.content
                )
            }

        }

        mcl.Notice = class MCL_Notice extends React.Component {

            /**
             * @typedef {Object} MCL_NoticeOptions
             * @property {string} [id='']
             * @property {string} [class='']
             * @property {string} [content='']
             * @property {'info' | 'help' | 'warning'} [type='info']
             * @property {'blue' | 'green' | 'yellow' | 'red'} [color='blue']
             */

            /**
             * @param {MCL_NoticeOptions} state 
             */

            constructor(state) {
                super(state)
                this.state = state
            }

            render() {

                var container = this.state;
                return React.createElement('div',
                    {
                        id: container?.id ?? '',
                        class: `MCL_Notice ${['blue', 'green', 'yellow', 'red'].includes(container.color)?container.color:'blue'} ${container?.class ?? ''}`
                    },
                    [
                        React.createElement(
                            'div',
                            {
                                class: `MCL_InfoSvg`
                            },
                            React.createElement(
                                mcl.Svg,
                                {
                                    ...(container.type=='warn'?mcl.Svg.Temps.Discord.warn:(container.type=='help'?mcl.Svg.Temps.Discord.help:mcl.Svg.Temps.Discord.info)),
                                    size: '24px',
                                }
                            )
                        ),
                        React.createElement(
                            'div',
                            {
                                class: `MCL_InfoContent`
                            },
                            container.content
                        ),
                    ]
                )
            }

        }

        mcl.Row = class MCL_Row extends React.Component {

            /**
             * @typedef {Object} MCL_RowOptions
             * @property {string} [id='']
             * @property {string} [class='']
             * @property {*[] | string} [content='']
             * @property {boolean} [wrap=false]
             * @property {boolean} [nosidemargin=false]
             * @property {'center' | 'start' | 'end' | 'flex-start' | 'flex-end' | 'left' | 'right' | 'normal' | 'space-between' | 'space-around' | 'space-evenly' | 'stretch' | 'safe center' | 'unsafe center' | 'inherit' | 'initial' | 'revert' | 'unset'} [align-items='space-between']
             * @property {'center' | 'start' | 'end' | 'flex-start' | 'flex-end' | 'left' | 'right' | 'normal' | 'space-between' | 'space-around' | 'space-evenly' | 'stretch' | 'safe center' | 'unsafe center' | 'inherit' | 'initial' | 'revert' | 'unset'} [justify-content='space-between']
             */

            /**
             * @param {MCL_RowOptions} state 
             */

            constructor(state) {
                super(state)
                this.state = state
            }

            render() {

                var content = this.state?.content;
                var options = this.state?.options;
                return React.createElement('div',
                    {
                        id: options?.id ?? '',
                        class: `MCL_Row ${options?.nosidemargin ?? true ? 'nosidemargin' : ''} ${options?.class ?? ''}`,
                        style: {
                            display: 'inline-flex',
                            width: '100%',
                            'flex-wrap': (options?.wrap)?'wrap':'nowrap',
                            'align-items': options?.['align-items'] ?? 'space-between',
                            'justify-content': options?.['justify-content'] ?? 'space-between'
                        },
                    },
                    content ?? ''
                )
            }
        }

        mcl.Column = class MCL_Column extends React.Component {

            /**
             * @typedef {Object} MCL_ColumnOptions
             * @property {string} [id='']
             * @property {string} [class='']
             * @property {*[] | string} [content='']
             * @property {boolean} [nosidemargin=false]
             * @property {'center' | 'start' | 'end' | 'flex-start' | 'flex-end' | 'left' | 'right' | 'normal' | 'space-between' | 'space-around' | 'space-evenly' | 'stretch' | 'safe center' | 'unsafe center' | 'inherit' | 'initial' | 'revert' | 'unset'} [justify-content='space-between']
             */

            /**
             * @param {MCL_ColumnOptions} state 
             */

            constructor(column) {
                super(column)
                this.state = column
            }

            render() {

                var content = this.state?.content;
                var options = this.state?.options;
                return React.createElement('div',
                    {
                        id: options?.id ?? '',
                        class: `MCL_Column ${options?.nosidemargin ?? false ? 'nosidemargin' : ''} ${options?.class ?? ''}`,
                        style: {
                            display: 'flex',
                            width: '100%',
                            'flex-direction': 'column',
                            'justify-content': options?.align ?? 'inline-flex'
                        },
                    },
                    content ?? ''
                )
            }
        }

        mcl.Field = class MCL_Field extends React.Component {

            /**
             * @typedef {Object} MCL_FieldOptions
             * @property {string} [id='']
             * @property {string} [class='']
             * @property {string} [title='']
             * @property {string} [note='']
             * @property {string} [content='']
             */

            /**
             * @param {MCL_FieldOptions} state 
             */
            
            constructor(state) {
                super(state)
                this.state = state
            }

            render() {

                var field = this.state;
                return React.createElement('div',
                    {
                        id: field?.id ?? '',
                        class: `MCL_Field ${field?.class ?? ''}`
                    },
                    [
                        React.createElement('div', { class: 'MCL_FieldTitle' }, field?.title ?? ''),
                        React.createElement('div', { class: 'MCL_FieldNote' }, field?.note ?? ''),
                        React.createElement('div', { class: 'MCL_FieldContent' }, field?.content ?? '')
                    ]
                )
            }
        }

        mcl.Tabs = class MCL_Tabs extends React.Component {

            /**
             * @typedef {Object} MCL_TabsTabOptions
             * @property {string} [name='']
             * @property {string} [content='']
             * @property {boolean} [opened=false]
             * @property {boolean} [disabled=false]
             */

            /**
             * @typedef {Object} MCL_TabsOptions
             * @property {string} [id='']
             * @property {string} [class='']
             * @property {string} [padding='none']
             * @property {string} [margin='none']
             * @property {Array<MCL_TabsTabOptions>} [tabs]
             */

            /**
             * @param {MCL_TabsOptions} state 
             */

            constructor(state) {
                super(state)
                this.state = state
            }

            render() {

                var options = this.state
                var tabs = options?.tabs
                

                class MCL_TabsDivider extends React.Component {

                    constructor(state) {
                        super(state)
                    }

                    render() {
                        return React.createElement('div', { class: `MCL_TabDivider` })
                    }
                }

                class MCL_TabsTab extends React.Component {

                    constructor(state) {
                        super(state)
                        this.state = state
                    }

                    render() {
                        var tab = this.state
                        return React.createElement('div',
                            {
                                'data-index': tab?.index,
                                class: `MCL_Tab ${tab?.disabled ? 'disabled' : ''} ${tab?.opened ? 'selected' : ''}`,
                                onClick: (e) => {
                                    if (tab?.disabled) return;
                                    var tab = e.currentTarget;
                                    var index = Number(tab.getAttribute('data-index'));
                                    var panel = tab.closest('.MCL_TabsPanel');

                                    panel.querySelector(`.MCL_TabsTabList`).querySelectorAll(`.MCL_Tab:not([data-index="${index}"])`).forEach(
                                        (tab) => {
                                            tab.classList.remove('selected')
                                        }
                                    );
                                    panel.querySelector(`.MCL_TabsContentList`).childNodes.forEach(
                                        (content, index) => {
                                            content.classList.remove('show')
                                        }
                                    );
                                    panel.querySelector(`.MCL_TabsTabList`).querySelector(`.MCL_Tab[data-index="${index}"]`).classList.toggle('selected')
                                    panel.querySelector(`.MCL_TabsContentList`).querySelector(`.MCL_Content[data-index="${index}"]`).classList.toggle('show')
                                }
                            },
                            tab?.name ?? ''
                        )
                    }
                }

                class MCL_TabsContent extends React.Component {

                    constructor(state) {
                        super(state)
                        this.state = state
                    }

                    render() {

                        var tabcontent = this.state

                        return React.createElement('div',
                            {
                                'data-index': tabcontent?.index,
                                class: `MCL_Content ${tabcontent?.opened ? 'show' : ''}`
                            },
                            tabcontent?.content ?? ''
                        )
                    }
                }

                return React.createElement('div',
                    {
                        id: options?.id ?? '',
                        class: `MCL_TabsPanel ${options?.class ?? ''}`,
                        style: {
                            margin: options?.margin ?? 'none',
                            padding: options?.padding ?? 'none'
                        },
                    },
                    [
                        React.createElement(mcl.Container,
                            {
                                type: 'secondary',
                                class: 'MCL_TabsTabList',
                                content: tabs.map(
                                    (tab, index) => {
                
                                        if (tab?.component == 'divider') {
                                            return React.createElement(MCL_TabsDivider)
                                        }
    
                                        return React.createElement(
                                            MCL_TabsTab,
                                            {
                                                ...tab,
                                                index: index,
                                            }
                                        )                                   
                                    }
                                )
                            },
                        ),
                        React.createElement(
                            'div',
                            {
                                class: 'MCL_TabsContentList'
                            },
                            tabs.map(
                                (tab, index) => React.createElement(
                                    MCL_TabsContent,
                                    {
                                        ...tab,
                                        index: index,
                                    }
                                )
                            )
                        ),
                    ]
                )
            }
        }

        mcl.testModal = () => {

            showConfirmationModal('MopsComponentsLib - Test',
                React.createElement('div', null,
                    [
                        React.createElement(mcl.Tabs,
                            {
                                tabs: [
                                    {
                                        name: 'Svgs',
                                        content: [
                                            React.createElement(mcl.Column,
                                                {
                                                    content: [
                                                        ...Object.keys(mcl.Svg.Temps).map(
                                                            title => {
                                                                return React.createElement(mcl.Field,
                                                                    {
                                                                        title: title,
                                                                        content: [
                                                                            React.createElement(mcl.Row,
                                                                                {
                                                                                    content: Object.keys(mcl.Svg.Temps[title]).map(
                                                                                        (svgname, index) => React.createElement(mcl.Svg,
                                                                                            { ...mcl.Svg.Temps[title][svgname], margin: '0.5%', background: 'black', size: '9%' }
                                                                                        )
                                                                                    ),
                                                                                    options: {
                                                                                        nosidemargin: false,
                                                                                        wrap: true,
                                                                                        'justify-content': 'center'
                                                                                    }
                                                                                }
                                                                            ),
                                                                        ]
                                                                    }
                                                                )
                                                            }
                                                        ),
                                                    ]
                                                }
                                            ),
                                        ]
                                    },
                                    {
                                        name: 'Inputs',
                                        content: [
                                            React.createElement(mcl.Input, { value: 'Input', placeholder: '' }),
                                            React.createElement(mcl.Row, {
                                                content: React.createElement(mcl.Input, { value: 'Row > Input', placeholder: '' })
                                            }),
                                            React.createElement(mcl.Column, {
                                                content: React.createElement(mcl.Input, { value: 'Column > Input', placeholder: '' })
                                            }),
                                            React.createElement(mcl.Textarea, {
                                                value: 'Text...',
                                                placeholder: 'Placeholder...'
                                            }),
                                        ]
                                    },
                                    {
                                        opened: true,
                                        name: 'Components',
                                        content: [
                                            React.createElement(mcl.Field,
                                                {
                                                    title: 'Buttons',
                                                    content: React.createElement(mcl.Tabs,
                                                        {
                                                            tabs: [
                                                                {
                                                                    name: 'Filled',
                                                                    content: [
                                                                        React.createElement(mcl.Row,
                                                                            {
                                                                                content: [
                                                                                    React.createElement(mcl.Button, { label: 'Button', color: 'blurple', svgs: [mcl.Svg.Temps.Discord.info] }),
                                                                                    React.createElement(mcl.Button, { label: 'Button', color: 'grey', svgs: [mcl.Svg.Temps.Discord.pencil] }),
                                                                                    React.createElement(mcl.Button, { label: 'Button', color: 'green', svgs: [mcl.Svg.Temps.Discord.checked] }),
                                                                                    React.createElement(mcl.Button, { label: 'Button', color: 'red', svgs: [mcl.Svg.Temps.Discord.unchecked] }),
                                                                                ]
                                                                            }
                                                                        )
                                                                    ]
                                                                },
                                                                {
                                                                    name: 'Inverted',
                                                                    content: [
                                                                        React.createElement(mcl.Row,
                                                                            {
                                                                                content: [
                                                                                    React.createElement(mcl.Button, { label: 'Button', color: 'blurple', fill: 'inverted', svgs: [mcl.Svg.Temps.Discord.info] }),
                                                                                    React.createElement(mcl.Button, { label: 'Button', color: 'grey', fill: 'inverted', svgs: [mcl.Svg.Temps.Discord.pencil] }),
                                                                                    React.createElement(mcl.Button, { label: 'Button', color: 'green', fill: 'inverted', svgs: [mcl.Svg.Temps.Discord.checked] }),
                                                                                    React.createElement(mcl.Button, { label: 'Button', color: 'red', fill: 'inverted', svgs: [mcl.Svg.Temps.Discord.unchecked] }),
                                                                                ]
                                                                            }
                                                                        )
                                                                    ]
                                                                },
                                                                {
                                                                    name: 'Underline',
                                                                    content: [
                                                                        React.createElement(mcl.Row,
                                                                            {
                                                                                content: [
                                                                                    React.createElement(mcl.Button, { label: 'Button', color: 'blurple', fill: 'underline', svgs: [mcl.Svg.Temps.Discord.info] }),
                                                                                    React.createElement(mcl.Button, { label: 'Button', color: 'grey', fill: 'underline', svgs: [mcl.Svg.Temps.Discord.pencil] }),
                                                                                    React.createElement(mcl.Button, { label: 'Button', color: 'green', fill: 'underline', svgs: [mcl.Svg.Temps.Discord.checked] }),
                                                                                    React.createElement(mcl.Button, { label: 'Button', color: 'red', fill: 'underline', svgs: [mcl.Svg.Temps.Discord.unchecked] }),
                                                                                ]
                                                                            }
                                                                        )
                                                                    ]
                                                                },
                                                            ]
                                                        }
                                                    ),
                                                }
                                            ),
                                            React.createElement(mcl.Divider),
                                            React.createElement(mcl.Field,
                                                {
                                                    title: 'Radio group',
                                                    content: React.createElement(mcl.RadioGroup,
                                                        {
                                                            value: '2',
                                                            radios: [
                                                                {
                                                                    name: 'Name',
                                                                    note: 'Note',
                                                                    value: '0',
                                                                },
                                                                {
                                                                    name: 'Name',
                                                                    note: 'Note',
                                                                    value: '1',
                                                                    color: 'green',
                                                                },
                                                                {
                                                                    name: 'Name',
                                                                    note: 'Note',
                                                                    value: '2',
                                                                    color: 'yellow',
                                                                },
                                                                {
                                                                    name: 'Name',
                                                                    note: 'Note',
                                                                    value: '3',
                                                                    color: 'red',
                                                                },
                                                            ]
                                                        }
                                                    ),
                                                }
                                            ),
                                            React.createElement(mcl.Divider),
                                            React.createElement(mcl.Field,
                                                {
                                                    title: 'Switchers',
                                                    content: React.createElement(mcl.Row,
                                                        {
                                                            content: [
                                                                React.createElement(mcl.Switcher, { checked: true, color: 'blurple' }),
                                                                React.createElement(mcl.Switcher, { checked: true, color: 'green' }),
                                                                React.createElement(mcl.Switcher, { checked: true, color: 'red' }),
                                                            ],
                                                            options: {'justify-content': 'start'}
                                                        }
                                                    ),
                                                }
                                            ),
                                            React.createElement(mcl.Divider),
                                            React.createElement(mcl.Field,
                                                {
                                                    title: 'Text',
                                                    content: React.createElement(mcl.Row,
                                                        {
                                                            content: [
                                                                React.createElement(mcl.Text, { content: ['Rickroll ', React.createElement(mcl.Text, { content: 'link', link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }),] }),
                                                            ],
                                                            options: {'justify-content': 'start'}
                                                        }
                                                    ),
                                                }
                                            ),
                                            React.createElement(mcl.Divider),
                                            React.createElement(mcl.Field,
                                                {
                                                    title: 'Markdown',
                                                    content: React.createElement(mcl.Markdown,
                                                        {
                                                            content: "```js\nBdApi.alert('Hello', 'world!');```"
                                                        }
                                                    ),
                                                }
                                            ),
                                        ]
                                    },
                                    {
                                        name: 'Containers',
                                        content: [
                                            React.createElement(
                                                mcl.Field,
                                                {
                                                    title: 'Info container',
                                                    content: [
                                                        React.createElement(
                                                            mcl.Tabs,
                                                            {
                                                                tabs: [
                                                                    {
                                                                        name: 'Blue',
                                                                        content: React.createElement(mcl.Notice, {color: 'blue', content: 'Content...'}),
                                                                    },
                                                                    {
                                                                        name: 'Green',
                                                                        content: React.createElement(mcl.Notice, {color: 'green', content: 'Content...'}),
                                                                    },
                                                                    {
                                                                        name: 'Yellow',
                                                                        content: React.createElement(mcl.Notice, {color: 'yellow', content: 'Content...'}),
                                                                    },
                                                                    {
                                                                        name: 'Red',
                                                                        content: React.createElement(mcl.Notice, {color: 'red', content: 'Content...'}),
                                                                    },
                                                                ],
                                                            }
                                                        ),
                                                        React.createElement(
                                                            mcl.Tabs,
                                                            {
                                                                tabs: [
                                                                    {
                                                                        name: 'Info',
                                                                        content: React.createElement(mcl.Notice, {type: 'info', content: 'Content...'}),
                                                                    },
                                                                    {
                                                                        name: 'Warn',
                                                                        content: React.createElement(mcl.Notice, {type: 'warn', content: 'Content...'}),
                                                                    },
                                                                    {
                                                                        name: 'Help',
                                                                        content: React.createElement(mcl.Notice, {type: 'help', content: 'Content...'}),
                                                                    },
                                                                ],
                                                            }
                                                        )
                                                    ]
                                                }
                                            ),
                                            React.createElement(
                                                mcl.Field,
                                                {
                                                    title: 'Containers',
                                                    content: ['notice', 'primary', 'secondary', 'secondary-alt', 'tertiary']
                                                    .map(
                                                        type=>React.createElement(mcl.Container, {type: type, content: type})
                                                    )
                                                }
                                            )
                                        ]
                                    },
                                ]
                            }
                        ),
                    ]
                )
            )
        }

        var css = `

        /* ALL */
        
        [class*=MCL_].disabled {
            opacity: 66.66%;
            cursor: not-allowed;
        }

        /* DIVIDER */

        .MCL_Divider {
            width: 100%;
            height: 1px;
            border-top: thin solid var(--background-modifier-accent);
            margin: 20px 0;
        }

        /* TEXT */

        .MCL_Text {
            height: fit-content;
            width: fit-content;
            color: #fff;
        }

        .MCL_Text + .MCL_Text {
            margin-left: 0;
        }

        .MCL_Text.link {
            color: var(--text-link);
            text-decoration: underline;
            cursor: pointer;
        }

        /* SWITCHER */

        .MCL_Switcher.green {
            --switcher-color: rgb(67, 181, 129);
        }
        .MCL_Switcher.blurple {
            --switcher-color: var(--brand-experiment);
        }
        .MCL_Switcher.red {
            --switcher-color: rgb(237, 66, 69);
        }

        .MCL_Switcher {
            min-width: 38px;
            max-width: 38px;
            height: 26px;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            padding: 0px 4px;
            border-radius: 25px;
            background-color: var(--switcher-color);
            transition: 250ms cubic-bezier(0,.3,.7,1) background-color;
        }

        .MCL_Switcher.unchecked {
            justify-content: flex-start;
            background-color: rgb(114, 118, 125);
        }

        .MCL_SwitcherCircle {
            border-radius: 50px;
            background-color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 20px;
            height: 20px;
            transition: 250ms cubic-bezier(0,.3,.7,1);
        }

        .MCL_SwitcherCircle svg * {
            transition: 250ms cubic-bezier(0,.3,.7,1);
        }

        .MCL_SwitcherCircle > svg {
            margin-right: 0 !important;
        }

        .MCL_Switcher.checked svg {
            fill: var(--switcher-color);
        }
        .MCL_Switcher.checked svg > path:nth-child(1) {
            d: path('${mcl.Svg.Temps.Discord.switcherTick.paths[0]}');
        }
        .MCL_Switcher.checked svg > path:nth-child(2) {
            d: path('${mcl.Svg.Temps.Discord.switcherTick.paths[1]}');
        }

        .MCL_Switcher.unchecked svg {
            fill: rgb(114, 118, 125);
        }
        .MCL_Switcher.unchecked svg > path:nth-child(1) {
            d: path('${mcl.Svg.Temps.Discord.switcherCross.paths[0]}');
        }
        .MCL_Switcher.unchecked svg > path:nth-child(2) {
            d: path('${mcl.Svg.Temps.Discord.switcherCross.paths[1]}');
        }

        /* INPUT */

        .MCL_Input {
            padding: 10px;
            height: 40px;
            font-size: 16px;
            box-sizing: border-box;
            width: 100%;
            border-radius: 3px;
            color: var(--text-normal);
            background-color: var(--deprecated-text-input-bg);
            border: 1px solid var(--deprecated-text-input-border);
            transition: border-color .2s ease-in-out;
        }

        .MCL_Input:hover {
            border-color: var(--deprecated-text-input-border-hover);
        }

        /* TEXTAREA */

        .MCL_Textarea {
            background-color: var(--deprecated-text-input-bg);
            border: 1px solid var(--deprecated-text-input-border);
            border-radius: 3px;
            box-sizing: bordder-box;
            padding: 8px;
            transition: border-color .2s ease-in-out;
            font-size: 16px;
            line-height: 1.125rem;
            color: white;
            resize: none;
        }

        .MCL_Textarea:hover {
            border-color: black;
        }

        /* RADIO GROUP */

        .MCL_Radio {
            display: flex;
            flex-direction: row;
            align-items: center;
            padding: 10px;
            background-color: var(--background-secondary);
            border-radius: 4px;
            border-left-width: 3px;
            border-left-style: solid;
        }

        .MCL_Radio:not(.selected):hover {
            background-color: var(--background-modifier-hover);
        }
        
        .MCL_Radio:not(last-of-type) {
            margin-bottom: 8px;
        }

        .MCL_Radio.selected {
            background-color: var(--background-tertiary);
        }

        .MCL_Radio > svg > circle {
            fill: transparent;
        }
        .MCL_Radio > svg > path {
            fill: var(--interactive-normal);
        }

        .MCL_Radio.selected > svg > path {
            fill: var(--interactive-active);
        }
        .MCL_Radio.selected > svg > circle {
            fill: var(--control-brand-foreground);
        }

        .MCL_Radio.none {
            border-left-color: transparent;
        }
        .MCL_Radio.green {
            border-left-color: hsl(139, calc(var(--saturation-factor, 1) * 47.3%), 43.9%);
        }
        .MCL_Radio.yellow {
            border-left-color: hsl(37, calc(var(--saturation-factor, 1) * 81.2%), 43.9%);
        }
        .MCL_Radio.red {
            border-left-color: hsl(359, calc(var(--saturation-factor, 1) * 82.6%), 59.4%);
        }

        .MCL_RadioInfo {
            display: flex;
            flex-direction: column;
        }

        .MCL_RadioName {
            margin-bottom: 4px;
            font-weight: 500;
            font-size: 16px;
            line-height: 20px;
        }

        .MCL_RadioNote {
            font-size: 14px;
            line-height: 18px;
        }

        .MCL_RadioName, .MCL_RadioNote {
            color: var(--interactive-normal);
        }
        .selected .MCL_RadioName, .selected .MCL_RadioNote {
            color: var(--interactive-active);
        }

        /* CONTAINER */

        .MCL_Container {
            padding: 16px;
            color: white;
        }

        .MCL_Container.notice {
            background: var(--deprecated-card-bg);
            border: thin solid var(--background-tertiary);
            border-radius: 5px;
            font-size: 14px;
        }

        .MCL_Container.primary {
            background-color: var(--background-primary);
            border-radius: 4px;
        }

        .MCL_Container.tertiary {
            background-color: var(--background-tertiary);
            border-radius: 4px;
        }

        .MCL_Container.secondary {
            background-color: var(--background-secondary);
            border-radius: 4px;
        }

        .MCL_Container.secondary-alt {
            background-color: var(--background-secondary-alt);
            border-radius: 4px;
        }

        /* INFO CONTAINER */     

        .MCL_Notice {
            display: flex;
            flex-direction: row;
            align-items: center;
            box-sizing: border-box;
            border-radius: 4px;
            font-weight: 500;
            padding: 8px;
            width: 100%;
        }

        .MCL_Notice > div.MCL_InfoSvg {
            width: 24px;
            height: 24px;
        }

        .MCL_Notice > div.MCL_InfoContent {
            height: fit-content;
            padding: 0;
            margin-left: 10px;
        }

        .MCL_Notice.blue {
            background: var(--info-help-background);
            border: 1px solid var(--info-help-foreground);
            color: var(--info-help-text);
        }

        .MCL_Notice.green {
            background: var(--info-positive-background);
            border: 1px solid var(--info-positive-foreground);
            color: var(--info-positive-text);
        }

        .MCL_Notice.yellow {
            background: var(--info-warning-background);
            border: 1px solid var(--info-warning-foreground);
            color: var(--info-warning-text);
        }

        .MCL_Notice.red {
            background: var(--info-danger-background);
            border: 1px solid var(--info-danger-foreground);
            color: var(--info-danger-text);
        }

        /* ROW */

        .MCL_Row.nosidemargin > *:first-child {
            margin-left: 0 !important;
        }

        .MCL_Row.nosidemargin > *:last-child {
            margin-right: 0 !important;
        }

        /* COLUMN */

        .MCL_Column > * {
            width: 100%;
        }

        /* FIELD */

        .MCL_FieldTitle {
            color: var(--header-secondary);
            margin-top: 20px;
            margin-bottom: 8px;
            font-size: 12px;
            line-height: 16px;
            font-weight: 600;
            text-transform: uppercase;
        }

        .MCL_FieldNote {
            color: var(--header-secondary);
            margin-bottom: 8px;
            font-size: 14px;
            line-height: 20px;
            font-weight: 400;
        }

        /* TABS */

        .MCL_Content {
            height: 0;
            width: 100%;
            overflow: hidden;
            opacity: 0;
            transition: 0.5s opacity;
        }

        .MCL_Content.show {
            display: block;
            height: fit-content;
            opacity: 1;
        }

        .MCL_Tab {
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

        .MCL_Tab + .MCL_Tab {
            margin-left: 0;
        }

        .MCL_Tab:hover:not(.selected):not(.disabled) {
            box-shadow: inset 0 0 0 1px var(--brand-experiment);
        }
        .MCL_Tab.selected {
            background-color: var(--brand-experiment);
        }

        .MCL_TabDivider {
            width: 0;
            height: 25px;
            margin: auto 0;
            border-right: thin solid var(--background-accent);
        }

        .MCL_TabsTabList {
            margin: 8px 0;
            padding: 0.5px;
            justify-content: space-between;
            display: flex;
        }

        /* BUTTONS */

        .MCL_Button {
            display: inline-block;
            transition: background-color .17s ease, color .17s ease, opacity 250ms ease;
            border-radius: 3px;
        }

        .MCL_Button.blurple.filled {
            color: white;
            background-color: var(--brand-experiment);
        }
        .MCL_Button.blurple.filled:hover:not(.disabled) {
            background-color: var(--brand-experiment-560);
        }
        .MCL_Button.blurple.inverted {
            background-color: #0000;
            color: var(--brand-experiment);
            box-shadow: inset 0 0 0 1px var(--brand-experiment);
        }
        .MCL_Button.blurple.inverted svg * {
            fill: var(--brand-experiment);
        }
        .MCL_Button.blurple.inverted:hover:not(.disabled) {
            background-color: #0000;
            color: var(--brand-experiment-560);
            box-shadow: inset 0 0 0 1px var(--brand-experiment-560);
        }
        .MCL_Button.blurple.inverted:hover:not(.disabled) svg * {
            fill: var(--brand-experiment-560);
        }

        .MCL_Button.grey.filled {
            color: white;
            background-color: #4f545c;
        }
        .MCL_Button.grey.filled:hover:not(.disabled) {
            background-color: #5d6269;
        }
        .MCL_Button.grey.inverted {
            background-color: #0000;
            color: #4f545c;
            box-shadow: inset 0 0 0 1px #4f545c;
        }
        .MCL_Button.grey.inverted svg * {
            fill: #4f545c;
        }
        .MCL_Button.grey.inverted:hover:not(.disabled) {
            background-color: #0000;
            color: #5d6269;
            box-shadow: inset 0 0 0 1px #5d6269;
        }
        .MCL_Button.grey.inverted:hover:not(.disabled) svg * {
            fill: #5d6269;
        }

        .MCL_Button.red.filled {
            color: white;
            background-color: hsl(359,calc(var(--saturation-factor, 1)*82.6%),59.4%);
        }
        .MCL_Button.red.filled:hover:not(.disabled) {
            background-color: hsl(359,calc(var(--saturation-factor, 1)*56.7%),48%);
        }
        .MCL_Button.red.inverted {
            background-color: #0000;
            color: hsl(359,calc(var(--saturation-factor, 1)*82.6%),59.4%);
            box-shadow: inset 0 0 0 1px hsl(359,calc(var(--saturation-factor, 1)*82.6%),59.4%);
        }
        .MCL_Button.red.inverted svg * {
            fill: hsl(359,calc(var(--saturation-factor, 1)*82.6%),59.4%);
        }
        .MCL_Button.red.inverted:hover:not(.disabled) {
            background-color: #0000;
            color: hsl(359,calc(var(--saturation-factor, 1)*56.7%),48%);
            box-shadow: inset 0 0 0 1px hsl(359,calc(var(--saturation-factor, 1)*56.7%),48%);
        }
        .MCL_Button.red.inverted:hover:not(.disabled) svg * {
            fill: hsl(359,calc(var(--saturation-factor, 1)*56.7%),48%);
        }

        .MCL_Button.green.filled {
            color: white;
            background-color: hsl(139,calc(var(--saturation-factor, 1)*47.3%),43.9%);
        }
        .MCL_Button.green.filled:hover:not(.disabled) {
            background-color: hsl(139,calc(var(--saturation-factor, 1)*47.1%),33.3%);
        }
        .MCL_Button.green.inverted {
            background-color: #0000;
            color: hsl(139,calc(var(--saturation-factor, 1)*47.3%),43.9%);
            box-shadow: inset 0 0 0 1px hsl(139,calc(var(--saturation-factor, 1)*47.3%),43.9%);
        }
        .MCL_Button.green.inverted svg * {
            fill: hsl(139,calc(var(--saturation-factor, 1)*47.3%),43.9%);
        }
        .MCL_Button.green.inverted:hover:not(.disabled) {
            background-color: #0000;
            color: hsl(139,calc(var(--saturation-factor, 1)*47.1%),33.3%);
            box-shadow: inset 0 0 0 1px hsl(139,calc(var(--saturation-factor, 1)*47.1%),33.3%);
        }
        .MCL_Button.green.inverted:hover:not(.disabled) svg * {
            fill: hsl(139,calc(var(--saturation-factor, 1)*47.1%),33.3%);
        }

        .MCL_Button.underline {
            background: transparent;
            color: white;
        }
        .MCL_Button.underline:hover:not(.disabled) {
            text-decoration: underline;
        }

        `

        return {obj: mcl, css: css}
    }

}