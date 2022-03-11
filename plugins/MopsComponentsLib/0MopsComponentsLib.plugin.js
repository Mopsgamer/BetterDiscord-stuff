/**
 * @name MopsComponentsLib
 * @version 0.0.2
 * @description Library of preset components.
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

    start() {

        const { showConfirmationModal, React } = BdApi;

        global.MopsComponentsLib = {}

        global.MopsComponentsLib.SvgPresets = {
            Logos: {
                discord: {
                    paths: [
                        'M23.0212 1.67671C21.3107 0.879656 19.5079 0.318797 17.6584 0C17.4062 0.461742 17.1749 0.934541 16.9708 1.4184C15.003 1.12145 12.9974 1.12145 11.0283 1.4184C10.819 0.934541 10.589 0.461744 10.3368 0.00546311C8.48074 0.324393 6.67795 0.885118 4.96746 1.68231C1.56727 6.77853 0.649666 11.7538 1.11108 16.652C3.10102 18.1418 5.3262 19.2743 7.69177 20C8.22338 19.2743 8.69519 18.4993 9.09812 17.691C8.32996 17.3997 7.58522 17.0424 6.87684 16.6135C7.06531 16.4762 7.24726 16.3387 7.42403 16.1847C11.5911 18.1749 16.408 18.1749 20.5763 16.1847C20.7531 16.3332 20.9351 16.4762 21.1171 16.6135C20.41 17.0369 19.6639 17.3997 18.897 17.691C19.3052 '
                        + '18.4993 19.7718 19.2689 20.3021 19.9945C22.6677 19.2689 24.8929 18.1364 26.8828 16.6466H26.8893C27.43 10.9731 25.9665 6.04728 23.0212 1.67671ZM9.68041 13.6383C8.39754 13.6383 7.34085 12.4453 7.34085 10.994C7.34085 9.54272 8.37155 8.34973 9.68041 8.34973C10.9893 8.34973 12.0395 9.54272 12.0187 10.994C12.0187 12.4453 10.9828 13.6383 9.68041 13.6383ZM18.3161 13.6383C17.0332 13.6383 15.9765 12.4453 15.9765 10.994C15.9765 9.54272 17.0124 8.34973 18.3161 8.34973C19.6184 8.34973 20.6751 9.54272 20.6543 10.994C20.6543 12.4453 19.6184 13.6383 18.3161 13.6383Z',
                    ],
                    viewBox: '0 -5 28 28'
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
            ByDiscord: {
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
                cross: {
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
                downloadArrow: {
                    paths: [
                        'M16.293 9.293L17.707 10.707L12 16.414L6.29297 10.707L7.70697 9.293L11 12.586V2H13V12.586L16.293 9.293ZM18 20V18H20V20C20 21.102 19.104 22 18 22H6C4.896 22 4 21.102 4 20V18H6V20H18Z',
                    ],
                    viewBox: '0 0 24 24'
                },
                linkArrow: {
                    paths: [
                        'M10 5V3H5.375C4.06519 3 3 4.06519 3 5.375V18.625C3 19.936 4.06519 21 5.375 21H18.625C19.936 21 21 19.936 21 18.625V14H19V19H5V5H10Z',
                        'M21 2.99902H14V4.99902H17.586L9.29297 13.292L10.707 14.706L19 6.41302V9.99902H21V2.99902Z'
                    ],
                    viewBox: '0 0 24 24'
                },
            },
            ByBetterDiscord: {
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
            },
            ByDev: {
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
                switcherRight: {
                    paths: [
                        'M 0 5 V 9 C 0 12 2 14 5 14 H 19 C 22 14 24 12 24 9 V 5 C 24 2 22 0 19 0 H 5 C 2 0 0 2 0 5 L 2 7 V 6 C 2 4 4 2 6 2 H 18 C 20 2 22 4 22 6 V 8 C 22 10 20 12 18 12 H 6 C 4 12 2 10 2 8 V 7 Z M 17 7 H 21 C 21 4 19 3 17 3 C 15 3 13 4 13 7 C 13 10 15 11 17 11 C 19 11 21 10 21 7 Z',
                    ],
                    viewBox: '0 -5 24 24'
                },
                switcherLeft: {
                    paths: [
                        'M 0 5 V 9 C 0 12 2 14 5 14 H 19 C 22 14 24 12 24 9 V 5 C 24 2 22 0 19 0 H 5 C 2 0 0 2 0 5 L 2 7 V 6 C 2 4 4 2 6 2 H 18 C 20 2 22 4 22 6 V 8 C 22 10 20 12 18 12 H 6 C 4 12 2 10 2 8 V 7 Z M 7 7 H 11 C 11 4 9 3 7 3 C 5 3 3 4 3 7 C 3 10 5 11 7 11 C 9 11 11 10 11 7 Z',
                    ],
                    viewBox: '0 -5 24 24'
                },
            },
        }

        global.MopsComponentsLib.Divider = class CL_Divider extends React.Component {

            constructor() {
                super()
            }

            render() {

                return React.createElement('div',
                    {
                        class: 'CL_Divider'
                    }
                )
            }
        }

        global.MopsComponentsLib.Text = class CL_Text extends React.Component {

            constructor(state) {
                super(state)
                this.state = state
            }

            render() {

                var text = this.state;

                return React.createElement('div',
                    {
                        class: `CL_Text ${text.link ? 'link' : ''}`,
                        style: (typeof text.style == 'object' && !Array.isArray(text.style) ? text.style : {}),
                        onClick: (e) => {
                            if(typeof text.link == 'string') window.open(text.link)
                        }
                    },
                    text.content
                )
            }
        }

        global.MopsComponentsLib.Svg = class CL_Svg extends React.Component {

            constructor(state) {
                super(state)
                this.state = state
            }

            render() {

                var state = this.state;
                return React.createElement('svg',
                    {
                        viewBox: state.viewBox ?? '0 0 24 24',
                        fill: state.color ?? '#fff',
                        style: {
                            background: state.background ?? 'none',
                            width: state.width ?? '16px',
                            height: state.height ?? '16px',
                            position: (['right', 'left']).includes(state.align ?? false) ? 'absolute' : 'relative',
                            right: (state.align == 'right') ? '12px' : 'none',
                            left: (state.align == 'left') ? '12px' : 'none',
                            'margin-right': '4px'
                        }
                    },
                    (state.paths ?? []).map(path => React.createElement('path', { d: path }))
                )
            }
        }

        global.MopsComponentsLib.Switcher = class CL_Switcher extends React.Component {

            constructor(state) {
                super(state)
                this.state = state
            }

            render() {

                var switcher = this.state;

                return React.createElement('div', {
                    style: {
                        margin: switcher?.margin ?? '8px',
                    },
                    id: switcher?.id ?? '',
                    class: `CL_Switcher ${switcher?.color ?? 'green'} ${switcher?.disabled ? 'disabled' : ''} ${switcher?.checked ? 'checked': 'unchecked'} ${switcher?.class ?? ''}`,
                    onClick: (e) => {
                        this.setState({checked: !this.state?.checked})

                        if (typeof switcher?.onclick == 'function') switcher.onclick(e, this.state?.checked)
                    }
                },
                    React.createElement('div',
                    {
                       class: `CL_SwitcherCircle`
                    },
                        React.createElement(global.MopsComponentsLib.Svg, { viewBox: global.MopsComponentsLib.SvgPresets.ByDiscord.switcherTick.viewBox, paths: ['', ''] })
                    )
                )
            }
        }

        global.MopsComponentsLib.Button = class CL_Button extends React.Component {

            constructor(state) {
                super(state)
                this.state = state
            }

            render() {

                class CL_ButtonLabel extends React.Component {

                    constructor(props) {
                        super(props)
                        this.label = props?.label ?? ''
                    }

                    render() {
                        return React.createElement('span', {
                            class: `CL_ButtonLabel`,
                        },
                            this.label
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
                        transition: 'background-color .17s ease, color .17s ease, opacity 250ms ease',
                    },
                    id: button.id ?? '',
                    class: `CL_Button ${button.disabled ? 'disabled' : ''} ${(['filled', 'inverted', 'underline']).includes(button.fill) ? button.fill : 'filled'} ${(['blurple', 'grey', 'green', 'red']).includes(button.color) ? button.color : 'blurple'} ${button.class ?? ''}`,
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
                            Array.isArray(button.svgs) ? button.svgs.map((svgTemp) => React.createElement(global.MopsComponentsLib.Svg, svgTemp)) : null,
                            React.createElement(CL_ButtonLabel, { label: button.label }),
                            typeof button.link == 'string' ? React.createElement(global.MopsComponentsLib.Svg, {
                                align: 'right',
                                paths: [
                                    ...global.MopsComponentsLib.IconPaths.linkArrow
                                ],
                            }) : null
                        ]
                    )
                )
            }
        }

        global.MopsComponentsLib.Input = class CL_Input extends React.Component {

            constructor(state) {
                super(state)
                this.state = state
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
                            margin: input.margin ?? '8px 0',
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
                        class: `CL_Input ${input.disabled ? 'disabled' : ''} ${input.class ?? ''}`,
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

        global.MopsComponentsLib.Textarea = class CL_Textarea extends React.Component {

            constructor(state) {
                super(state)
                this.state = state
            }

            render() {
                var textarea = this.state;
                return React.createElement('textarea',
                    {
                        style: {
                            height: textarea?.height ?? '270px',
                            width: textarea?.width ?? 'calc(100% - 18px)'
                        },
                        spellcheck: 'false',
                        type: textarea?.type ?? 'text',
                        placeholder: textarea?.placeholder ?? '',
                        class: `CL_Textarea ${textarea?.disabled ? 'disabled' : ''} ${textarea?.invalid ? 'invalid' : ''} ${textarea?.class ?? ''} ${MopsComponentsLib.modules.ScrollbarDefault}`,
                        onChange: (e) => {
                            textarea.onchange?.(e)
                        },
                        onClick: (e) => {
                            textarea.onclick?.(e)
                        }
                    },
                    textarea.value
                )
            }
        }

        global.MopsComponentsLib.Field = class CL_Field extends React.Component {

            constructor(state) {
                super(state)
                this.state = state
            }

            render() {
                return React.createElement('div',
                    {
                        class: 'CL_Field'
                    },
                    [
                        React.createElement('div', { class: 'CL_FieldTitle' }, this.state?.title),
                        React.createElement('div', { class: 'CL_FieldNote' }, this.state?.note),
                        React.createElement('div', { class: 'CL_FieldContent' }, this.state?.content)
                    ]
                )
            }
        }

        global.MopsComponentsLib.Row = class CL_Row extends React.Component {

            constructor(state) {
                super(state)
                this.state = state
            }

            render() {

                var content = this.state?.content;
                var options = this.state?.options;
                return React.createElement('div',
                    {
                        style: {
                            display: 'inline-flex',
                            width: '100%',
                            'align-items': options?.['align-items'] ?? 'space-between',
                            'justify-content': options?.['justify-content'] ?? 'space-between'
                        },
                        class: `CL_Row ${options?.nosidemargin ?? true ? 'nosidemargin' : ''}`
                    },
                    content
                )
            }
        }

        global.MopsComponentsLib.Column = class CL_Column extends React.Component {

            constructor(column) {
                super(column)
                this.state = column
            }

            render() {

                var content = this.state?.content;
                var options = this.state?.options;
                return React.createElement('div',
                    {
                        style: {
                            display: 'flex',
                            width: '100%',
                            'flex-direction': 'column',
                            'justify-content': options?.align ?? 'inline-flex'
                        },
                        class: `CL_Column ${options?.nosidemargin ?? false ? 'nosidemargin' : ''}`
                    },
                    content
                )
            }
        }

        global.MopsComponentsLib.Tabs = class CL_Tabs extends React.Component {

            constructor(state) {
                super(state)
                this.state = state
            }

            render() {

                var tabs = this.state?.tabs
                var options = this.state?.options

                var openedReserved = false

                class CL_TabsDivider extends React.Component {

                    constructor(state) {
                        super(state)
                    }

                    render() {
                        return React.createElement('div', { class: `CL_TabDivider` })
                    }
                }

                class CL_TabsTab extends React.Component {

                    constructor(state) {
                        super(state)
                        this.state = state
                    }

                    render() {
                        var tab = this.state
                        return React.createElement('div',
                            {
                                'data-index': tab?.index,
                                class: `CL_Tab ${tab?.disabled ? 'disabled' : ''} ${tab?.opened ? 'selected' : ''}`,
                                onClick: (e) => {
                                    if (tab?.disabled) return;
                                    var tab = e.currentTarget;
                                    var index = Number(tab.getAttribute('data-index'));
                                    var panel = tab.closest('.CL_TabsPanel');

                                    panel.querySelectorAll(`.CL_Tab:not([data-index="${index}"])`).forEach(
                                        (content) => {
                                            content.classList.remove('selected')
                                        }
                                    );
                                    panel.querySelectorAll(`.CL_Content:not([data-index="${index}"])`).forEach(
                                        (content) => {
                                            content.classList.remove('show')
                                        }
                                    );
                                    panel.querySelector(`.CL_Tab[data-index="${index}"]`).classList.toggle('selected')
                                    panel.querySelector(`.CL_Content[data-index="${index}"]`).classList.toggle('show')
                                }
                            },
                            tab?.name
                        )
                    }
                }

                class CL_TabsContent extends React.Component {

                    constructor(state) {
                        super(state)
                        this.state = state
                    }

                    render() {

                        var tabcontent = this.state

                        return React.createElement('div',
                            {
                                'data-index': tabcontent?.index,
                                class: `CL_Content ${tabcontent?.opened ? 'show' : ''}`
                            },
                            tabcontent?.content ?? null
                        )
                    }
                }

                return React.createElement('div',
                    {
                        style: {
                            margin: options?.margin ?? 'none',
                            padding: options?.padding ?? 'none'
                        },
                        class: `CL_TabsPanel ${options?.class ?? ''}`
                    },
                    [
                        React.createElement('div',
                            {
                                class: 'CL_TabsTabList'
                            },
                            tabs.map(
                                (tab, index) => {
            
                                    if (tab?.component == 'divider') {
                                        return React.createElement(CL_TabsDivider)
                                    }

                                    if(tab.opened && Number.isFinite(openedReserved))
                                    console.warn(`[MopsComponentsLib] "opened: true" in the Tab "${tab.name}", but there is already an open tab - "${tabs[openedReserved].name}".`)
                                    
                                    return React.createElement(
                                        CL_TabsTab,
                                        {
                                            index: index,
                                            name: tab.name,
                                            opened: (tab.opened && !Number.isFinite(openedReserved)) ? Number.isFinite(openedReserved=index) : false,
                                        }
                                    )                                   
                                }
                            )
                        ),
                        React.createElement(
                            'div',
                            {
                                class: 'CL_TabsContentList'
                            },
                            tabs.map(
                                (tab, index) => React.createElement(
                                    CL_TabsContent,
                                    {
                                        index: index,
                                        content: tab.content,
                                        opened: index==openedReserved,
                                    }
                                )
                            )
                        ),
                    ]
                )
            }
        }

        global.MopsComponentsLib.testModal = () => {
            var cl = global.MopsComponentsLib;

            showConfirmationModal('MopsComponentsLib - Test',
                React.createElement('div', null,
                    [
                        React.createElement(cl.Column,
                            {
                                content: [
                                    React.createElement(cl.Field,
                                        {
                                            title: 'Logos',
                                            content: [
                                                React.createElement(cl.Row,
                                                    {
                                                        content: [
                                                            React.createElement(cl.Svg,
                                                                { ...cl.SvgPresets.Logos.discord, margin: '0 1% 0 0', background: 'black', width: '9%', height: '9%' }
                                                            ),
                                                            React.createElement(cl.Svg,
                                                                { ...cl.SvgPresets.Logos.github, margin: '0 1% 0 0', background: 'black', width: '9%', height: '9%' }
                                                            ),
                                                            React.createElement(cl.Svg,
                                                                { ...cl.SvgPresets.Logos.patreon, margin: '0 1% 0 0', background: 'black', width: '9%', height: '9%' }
                                                            ),
                                                        ],
                                                        options: {
                                                            'justify-content': 'center'
                                                        }
                                                    }
                                                ),
                                            ]
                                        }
                                    ),
                                    React.createElement(cl.Field,
                                        {
                                            title: 'By Discord',
                                            content: [
                                                React.createElement(cl.Row,
                                                    {
                                                        content: [
                                                            React.createElement(cl.Svg,
                                                                { ...cl.SvgPresets.ByDiscord.switcherTick, margin: '0 1% 0 0', background: 'black', width: '9%', height: '9%' }
                                                            ),
                                                            React.createElement(cl.Svg,
                                                                { ...cl.SvgPresets.ByDiscord.switcherCross, margin: '0 1% 0 0', background: 'black', width: '9%', height: '9%' }
                                                            ),
                                                            React.createElement(cl.Svg,
                                                                { ...cl.SvgPresets.ByDiscord.gear, margin: '0 1% 0 0', background: 'black', width: '9%', height: '9%' }
                                                            ),
                                                            React.createElement(cl.Svg,
                                                                { ...cl.SvgPresets.ByDiscord.pencil, margin: '0 1% 0 0', background: 'black', width: '9%', height: '9%' }
                                                            ),
                                                            React.createElement(cl.Svg,
                                                                { ...cl.SvgPresets.ByDiscord.cross, margin: '0 1% 0 0', background: 'black', width: '9%', height: '9%' }
                                                            ),
                                                            React.createElement(cl.Svg,
                                                                { ...cl.SvgPresets.ByDiscord.info, margin: '0 1% 0 0', background: 'black', width: '9%', height: '9%' }
                                                            ),
                                                            React.createElement(cl.Svg,
                                                                { ...cl.SvgPresets.ByDiscord.help, margin: '0 1% 0 0', background: 'black', width: '9%', height: '9%' }
                                                            ),
                                                            React.createElement(cl.Svg,
                                                                { ...cl.SvgPresets.ByDiscord.downloadArrow, margin: '0 1% 0 0', background: 'black', width: '9%', height: '9%' }
                                                            ),
                                                            React.createElement(cl.Svg,
                                                                { ...cl.SvgPresets.ByDiscord.linkArrow, margin: '0 1% 0 0', background: 'black', width: '9%', height: '9%' }
                                                            ),
                                                        ],
                                                        options: {
                                                            'justify-content': 'center'
                                                        }
                                                    }
                                                ),
                                            ]
                                        }
                                    ),
                                    React.createElement(cl.Field,
                                        {
                                            title: 'By BetterDiscord',
                                            content: [
                                                React.createElement(cl.Row,
                                                    {
                                                        content: [
                                                            React.createElement(cl.Svg,
                                                                { ...cl.SvgPresets.ByBetterDiscord.list, margin: '0 1% 0 0', background: 'black', width: '9%', height: '9%' }
                                                            ),
                                                            React.createElement(cl.Svg,
                                                                { ...cl.SvgPresets.ByBetterDiscord.tile, margin: '0 1% 0 0', background: 'black', width: '9%', height: '9%' }
                                                            ),
                                                            React.createElement(cl.Svg,
                                                                { ...cl.SvgPresets.ByBetterDiscord.puzzle, margin: '0 1% 0 0', background: 'black', width: '9%', height: '9%' }
                                                            ),
                                                            React.createElement(cl.Svg,
                                                                { ...cl.SvgPresets.ByBetterDiscord.gear, margin: '0 1% 0 0', background: 'black', width: '9%', height: '9%' }
                                                            ),
                                                            React.createElement(cl.Svg,
                                                                { ...cl.SvgPresets.ByBetterDiscord.pencil, margin: '0 1% 0 0', background: 'black', width: '9%', height: '9%' }
                                                            ),
                                                            React.createElement(cl.Svg,
                                                                { ...cl.SvgPresets.ByBetterDiscord.trash, margin: '0 1% 0 0', background: 'black', width: '9%', height: '9%' }
                                                            ),
                                                            React.createElement(cl.Svg,
                                                                { ...cl.SvgPresets.ByBetterDiscord.web, margin: '0 1% 0 0', background: 'black', width: '9%', height: '9%' }
                                                            ),
                                                            React.createElement(cl.Svg,
                                                                { ...cl.SvgPresets.ByBetterDiscord.help, margin: '0 1% 0 0', background: 'black', width: '9%', height: '9%' }
                                                            ),
                                                            React.createElement(cl.Svg,
                                                                { ...cl.SvgPresets.ByBetterDiscord.donate, margin: '0 1% 0 0', background: 'black', width: '9%', height: '9%' }
                                                            ),
                                                            React.createElement(cl.Svg,
                                                                { ...cl.SvgPresets.ByBetterDiscord.changelogArrow, margin: '0 1% 0 0', background: 'black', width: '9%', height: '9%' }
                                                            ),
                                                        ],
                                                        options: {
                                                            'justify-content': 'center'
                                                        }
                                                    }
                                                ),
                                            ]
                                        }
                                    ),
                                    React.createElement(cl.Field,
                                        {
                                            title: 'By developer',
                                            content: [
                                                React.createElement(cl.Row,
                                                    {
                                                        content: [
                                                            React.createElement(cl.Svg,
                                                                { ...cl.SvgPresets.ByDev.circleArrow, margin: '0 1% 0 0', background: 'black', width: '9%', height: '9%' }
                                                            ),
                                                            React.createElement(cl.Svg,
                                                                { ...cl.SvgPresets.ByDev.list, margin: '0 1% 0 0', background: 'black', width: '9%', height: '9%' }
                                                            ),
                                                            React.createElement(cl.Svg,
                                                                { ...cl.SvgPresets.ByDev.switcherRight, margin: '0 1% 0 0', background: 'black', width: '9%', height: '9%' }
                                                            ),
                                                            React.createElement(cl.Svg,
                                                                { ...cl.SvgPresets.ByDev.switcherLeft, margin: '0 1% 0 0', background: 'black', width: '9%', height: '9%' }
                                                            ),
                                                        ],
                                                        options: {
                                                            'justify-content': 'center'
                                                        }
                                                    }
                                                ),
                                            ]
                                        }
                                    ),
                                ]
                            }
                        ),
                        React.createElement(cl.Divider),
                        React.createElement(cl.Row, {
                            content: [
                                React.createElement(cl.Switcher, { checked: true }),
                                React.createElement(cl.Row,
                                    {
                                        content: [
                                            React.createElement(cl.Text, { content: 'Rickroll' }),
                                            React.createElement(cl.Text, { content: 'link', link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }),
                                        ],
                                        options: {'justify-content': 'center'}
                                    }
                                ),
                                React.createElement(cl.Switcher, {checked: true, color: 'blurple'}),
                            ]
                        }),
                        React.createElement(cl.Input, { value: 'hello?', placeholder: 'user?' }),
                        React.createElement(cl.Row, {
                            content: React.createElement(cl.Input, { value: 'Mmmm', placeholder: 'nice' })
                        }),
                        React.createElement(cl.Tabs,
                            {
                                tabs: [
                                    {
                                        name: 'Tab1',
                                        content: React.createElement(cl.Tabs,
                                            {
                                                tabs: [
                                                    {
                                                        name: 'Tab1 > Tab2',
                                                        content: React.createElement(cl.Column,
                                                            {
                                                                content: [
                                                                    React.createElement(cl.Button),
                                                                    React.createElement(cl.Button),
                                                                    React.createElement(cl.Button),
                                                                    React.createElement(cl.Button),
                                                                    React.createElement(cl.Button),
                                                                    React.createElement(cl.Button),
                                                                    React.createElement(cl.Button),
                                                                    React.createElement(cl.Button),
                                                                    React.createElement(cl.Button),
                                                                    React.createElement(cl.Button),
                                                                    React.createElement(cl.Button),
                                                                    React.createElement(cl.Button),
                                                                    React.createElement(cl.Button),
                                                                    React.createElement(cl.Button),
                                                                    React.createElement(cl.Button),
                                                                    React.createElement(cl.Button),
                                                                ]
                                                            }                                                            
                                                        )
                                                    },
                                                    { component: 'divider' },
                                                    {
                                                        name: 'Tab1 > Tab3'
                                                    }
                                                ]
                                            }
                                        )
                                    }
                                ]
                            }
                        ),
                        React.createElement(cl.Divider),
                        React.createElement(cl.Field,
                            {
                                title: 'Buttons',
                                note: 'UwU',
                                content: React.createElement(cl.Tabs,
                                    {
                                        tabs: [
                                            {
                                                name: 'Filled',
                                                opened: true,
                                                content: [
                                                    React.createElement(cl.Row,
                                                        {
                                                            content: [
                                                                React.createElement(cl.Button, { label: 'Button' }),
                                                                React.createElement(cl.Button, { label: 'Button', color: 'grey' }),
                                                                React.createElement(cl.Button, { label: 'Button', color: 'green' }),
                                                                React.createElement(cl.Button, { label: 'Button', color: 'red' }),
                                                            ]
                                                        }
                                                    )
                                                ]
                                            },
                                            {
                                                name: 'Inverted',
                                                content: [
                                                    React.createElement(cl.Row,
                                                        {
                                                            content: [
                                                                React.createElement(cl.Button, { label: 'Button', fill: 'inverted' }),
                                                                React.createElement(cl.Button, { label: 'Button', color: 'grey', fill: 'inverted' }),
                                                                React.createElement(cl.Button, { label: 'Button', color: 'green', fill: 'inverted' }),
                                                                React.createElement(cl.Button, { label: 'Button', color: 'red', fill: 'inverted' }),
                                                            ]
                                                        }
                                                    )
                                                ]
                                            },
                                            {
                                                name: 'Underline',
                                                content: [
                                                    React.createElement(cl.Row,
                                                        {
                                                            content: [
                                                                React.createElement(cl.Button, { label: 'Button', fill: 'underline' }),
                                                                React.createElement(cl.Button, { label: 'Button', color: 'grey', fill: 'underline' }),
                                                                React.createElement(cl.Button, { label: 'Button', color: 'green', fill: 'underline' }),
                                                                React.createElement(cl.Button, { label: 'Button', color: 'red', fill: 'underline' }),
                                                            ]
                                                        }
                                                    )
                                                ]
                                            },
                                        ]
                                    }
                                )
                            }
                        ),
                        React.createElement(cl.Divider),
                        React.createElement(cl.Textarea, {
                            placeholder: 'hello, man'
                        })
                    ]
                )
            )
        }

        BdApi.injectCSS
        ('MopsComponentsLib', `

        /* ALL */
        
        [class*=CL_].disabled {
            opacity: 66.66%;
            cursor: not-allowed;
        }

        /* DIVIDER */

        .CL_Divider {
            width: 100%;
            height: 1px;
            border-top: thin solid var(--background-modifier-accent);
            margin: 20px 0;
        }

        /* TEXT */

        .CL_Text {
            width: fit-content;
            color: #fff;
            margin: 8px;
        }

        .CL_Text + .CL_Text {
            margin-left: 0;
        }

        .CL_Text.link {
            text-decoration: underline;
        }

        /* SWITCHER */

        .CL_Switcher.green {
            --switcher-color: rgb(67, 181, 129);
        }
        .CL_Switcher.blurple {
            --switcher-color: var(--brand-experiment);
        }

        .CL_Switcher {
            min-width: 36px;
            max-width: 36px;
            height: 20px;
            padding: 4px 0 0 4px;
            border-radius: 25px;
            background-color: var(--switcher-color);
            transition: 250ms cubic-bezier(0,.3,.7,1) background-color;
        }

        .CL_Switcher.unchecked {
            background-color: rgb(114, 118, 125);
        }

        .CL_SwitcherCircle {
            border-radius: 50px;
            background-color: #fff;
            width: 16px;
            height: 16px;
            transition: 250ms cubic-bezier(0,.3,.7,1);
            transform: translateX(0.1px)
        }

        .checked .CL_SwitcherCircle {
            transform: translateX(16px)
        }

        .CL_SwitcherCircle > svg {
            width: 28px;
            height: 28px;
            margin-right: 0 !important;
            transition: 250ms cubic-bezier(0,.3,.7,1);
        }

        .CL_Switcher.checked svg {
            fill: var(--switcher-color);
        }
        .CL_Switcher.checked svg > path:nth-child(1) {
            d: path('${global.MopsComponentsLib.SvgPresets.ByDiscord.switcherTick.paths[0]}');
        }
        .CL_Switcher.checked svg > path:nth-child(2) {
            d: path('${global.MopsComponentsLib.SvgPresets.ByDiscord.switcherTick.paths[1]}');
        }

        .CL_Switcher.unchecked svg {
            fill: rgb(114, 118, 125);
        }
        .CL_Switcher.unchecked svg > path:nth-child(1) {
            d: path('${global.MopsComponentsLib.SvgPresets.ByDiscord.switcherCross.paths[0]}');
        }
        .CL_Switcher.unchecked svg > path:nth-child(2) {
            d: path('${global.MopsComponentsLib.SvgPresets.ByDiscord.switcherCross.paths[1]}');
        }

        /* INPUT */

        .CL_Input {
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

        .CL_Input:hover {
            border-color: var(--deprecated-text-input-border-hover);
        }

        /* TEXTAREA */
        .CL_Textarea {
            background-color: var(--deprecated-text-input-bg);
            border: 1px solid var(--deprecated-text-input-border);
            border-radius: 3px;
            box-sizing: bordder-box;
            margin-top: 20px;
            padding: 8px;
            transition: border-color .2s ease-in-out;
            font-size: 16px;
            line-height: 1.125rem;
            color: white;
            resize: none;
        }

        .CL_Textarea:hover {
            border-color: black;
        }

        /* ROW */

        .CL_Row.nosidemargin > *:first-child {
            margin-left: 0 !important;
        }

        .CL_Row.nosidemargin > *:last-child {
            margin-right: 0 !important;
        }

        /* COLUMN */

        .CL_Column > * {
            width: 100%;
        }

        /* FIELD */

        .CL_FieldTitle {
            color: var(--header-secondary);
            margin-top: 20px;
            margin-bottom: 8px;
            font-size: 12px;
            line-height: 16px;
            font-weight: 600;
            text-transform: uppercase;
        }

        .CL_FieldNote {
            color: var(--header-secondary);
            margin-bottom: 8px;
            font-size: 14px;
            line-height: 20px;
            font-weight: 400;
        }

        /* TABS */

        .CL_Content {
            height: 0;
            width: 100%;
            overflow: hidden;
            opacity: 0;
            transition: 0.5s opacity;
        }

        .CL_Content.show {
            display: block;
            height: fit-content;
            opacity: 1;
        }

        .CL_TabsContentList {
            margin-top: 20px;
        }

        .CL_Tab {
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

        .CL_Tab + .CL_Tab {
            margin-left: 0;
        }

        .CL_Tab:hover:not(.selected):not(.disabled) {
            box-shadow: inset 0 0 0 1px var(--brand-experiment);
        }
        .CL_Tab.selected {
            background-color: var(--brand-experiment);
        }

        .CL_TabDivider {
            width: 0;
            height: 25px;
            margin: auto 0;
            border-right: thin solid var(--background-accent);
        }

        .CL_TabsTabList {
            margin: 8px 0;
            border-radius: 3px;
            background-color: var(--background-secondary-alt);
            justify-content: space-between;
            display: flex;
        }

        /* BUTTONS */

        .CL_Button {
            border-radius: 3px;
        }

        .CL_Button.blurple.filled {
            color: white;
            background-color: var(--brand-experiment);
        }
        .CL_Button.blurple.filled:hover:not(.disabled) {
            background-color: var(--brand-experiment-560);
        }
        .CL_Button.blurple.inverted {
            background-color: #0000;
            color: var(--brand-experiment);
            box-shadow: inset 0 0 0 1px var(--brand-experiment);
        }
        .CL_Button.blurple.inverted:hover:not(.disabled) {
            background-color: #0000;
            color: var(--brand-experiment-560);
            box-shadow: inset 0 0 0 1px var(--brand-experiment-560);
        }

        .CL_Button.grey.filled {
            color: white;
            background-color: #4f545c;
        }
        .CL_Button.grey.filled:hover:not(.disabled) {
            background-color: #5d6269;
        }
        .CL_Button.grey.inverted {
            background-color: #0000;
            color: #4f545c;
            box-shadow: inset 0 0 0 1px #4f545c;
        }
        .CL_Button.grey.inverted:hover:not(.disabled) {
            background-color: #0000;
            color: #5d6269;
            box-shadow: inset 0 0 0 1px #5d6269;
        }

        .CL_Button.red.filled {
            color: white;
            background-color: hsl(359,calc(var(--saturation-factor, 1)*82.6%),59.4%);
        }
        .CL_Button.red.filled:hover:not(.disabled) {
            background-color: hsl(359,calc(var(--saturation-factor, 1)*56.7%),48%);
        }
        .CL_Button.red.inverted {
            background-color: #0000;
            color: hsl(359,calc(var(--saturation-factor, 1)*82.6%),59.4%);
            box-shadow: inset 0 0 0 1px hsl(359,calc(var(--saturation-factor, 1)*82.6%),59.4%);
        }
        .CL_Button.red.inverted:hover:not(.disabled) {
            background-color: #0000;
            color: hsl(359,calc(var(--saturation-factor, 1)*56.7%),48%);
            box-shadow: inset 0 0 0 1px hsl(359,calc(var(--saturation-factor, 1)*56.7%),48%);
        }

        .CL_Button.green.filled {
            color: white;
            background-color: hsl(139,calc(var(--saturation-factor, 1)*47.3%),43.9%);
        }
        .CL_Button.green.filled:hover:not(.disabled) {
            background-color: hsl(139,calc(var(--saturation-factor, 1)*47.1%),33.3%);
        }
        .CL_Button.green.inverted {
            background-color: #0000;
            color: hsl(139,calc(var(--saturation-factor, 1)*47.3%),43.9%);
            box-shadow: inset 0 0 0 1px hsl(139,calc(var(--saturation-factor, 1)*47.3%),43.9%);
        }
        .CL_Button.green.inverted:hover:not(.disabled) {
            background-color: #0000;
            color: hsl(139,calc(var(--saturation-factor, 1)*47.1%),33.3%);
            box-shadow: inset 0 0 0 1px hsl(139,calc(var(--saturation-factor, 1)*47.1%),33.3%);
        }

        .CL_Button.underline {
            background: transparent;
            color: white;
        }
        .CL_Button.underline:hover:not(.disabled) {
            text-decoration: underline;
        }

        `)
    }

    stop() {
        delete global.MopsComponentsLib;
        BdApi.clearCSS('MopsComponentsLib')
    }

}