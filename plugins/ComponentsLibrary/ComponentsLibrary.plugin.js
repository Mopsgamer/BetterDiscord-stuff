/**
 * @name ComponentsLibrary
 * @version 0.0.1
 * @description Library of preset components.
 * @author Mops
 * @authorLink https://github.com/Mopsgamer/
 * @authorId 538010208023347200
 * @website https://github.com/Mopsgamer/BetterDiscord-codes/tree/ComponentsLibrary
 * @source https://raw.githubusercontent.com/Mopsgamer/BetterDiscord-codes/ComponentsLibrary/ComponentsLibrary.plugin.js
 * @updateUrl https://raw.githubusercontent.com/Mopsgamer/BetterDiscord-codes/ComponentsLibrary/ComponentsLibrary.plugin.js
 */

module.exports = class ComponentsLibrary {

    start() {

        const { showConfirmationModal, React } = BdApi;

        global.ComponentsLibrary = {}

        global.ComponentsLibrary.IconPaths = {
            discordLogo: 'M23.0212 1.67671C21.3107 0.879656 19.5079 0.318797 17.6584 0C17.4062 0.461742 17.1749 0.934541 16.9708 1.4184C15.003 1.12145 12.9974 1.12145 11.0283 1.4184C10.819 0.934541 10.589 0.461744 10.3368 0.00546311C8.48074 0.324393 6.67795 0.885118 4.96746 1.68231C1.56727 6.77853 0.649666 11.7538 1.11108 16.652C3.10102 18.1418 5.3262 19.2743 7.69177 20C8.22338 19.2743 8.69519 18.4993 9.09812 17.691C8.32996 17.3997 7.58522 17.0424 6.87684 16.6135C7.06531 16.4762 7.24726 16.3387 7.42403 16.1847C11.5911 18.1749 16.408 18.1749 20.5763 16.1847C20.7531 16.3332 20.9351 16.4762 21.1171 16.6135C20.41 17.0369 19.6639 17.3997 18.897 17.691C19.3052 '
                + '18.4993 19.7718 19.2689 20.3021 19.9945C22.6677 19.2689 24.8929 18.1364 26.8828 16.6466H26.8893C27.43 10.9731 25.9665 6.04728 23.0212 1.67671ZM9.68041 13.6383C8.39754 13.6383 7.34085 12.4453 7.34085 10.994C7.34085 9.54272 8.37155 8.34973 9.68041 8.34973C10.9893 8.34973 12.0395 9.54272 12.0187 10.994C12.0187 12.4453 10.9828 13.6383 9.68041 13.6383ZM18.3161 13.6383C17.0332 13.6383 15.9765 12.4453 15.9765 10.994C15.9765 9.54272 17.0124 8.34973 18.3161 8.34973C19.6184 8.34973 20.6751 9.54272 20.6543 10.994C20.6543 12.4453 19.6184 13.6383 18.3161 13.6383Z',
            githubLogo: 'm12 .5c-6.63 0-12 5.28-12 11.792 0 5.211 3.438 9.63 8.205 11.188.6.111.82-.254.82-.567 0-.28-.01-1.022-.015-2.005-3.338.711-4.042-1.582-4.042-1.582-.546-1.361-1.335-1.725-1.335-1.725-1.087-.731.084-.716.084-.716 1.205.082 1.838 1.215 1.838 1.215 1.07 1.803 2.809 1.282 3.495.981.108-.763.417-1.282.76-1.577-2.665-.295-5.466-1.309-5.466-5.827 0-1.287.465-2.339 1.235-3.164-.135-.298-.54-1.497.105-3.121 0 0 1.005-.316 3.3 1.209.96-.262 1.98-.392 3-.398 1.02.006 2.04.136 3 .398 2.28-1.525 3.285-1.209 '
                + '3.285-1.209.645 1.624.24 2.823.12 3.121.765.825 1.23 1.877 1.23 3.164 0 4.53-2.805 5.527-5.475 5.817.42.354.81 1.077.81 2.182 0 1.578-.015 2.846-.015 3.229 0 .309.21.678.825.56 4.801-1.548 8.236-5.97 8.236-11.173 0-6.512-5.373-11.792-12-11.792z',

            switcherRight: 'M 0 5 V 9 C 0 12 2 14 5 14 H 19 C 22 14 24 12 24 9 V 5 C 24 2 22 0 19 0 H 5 C 2 0 0 2 0 5 L 2 7 V 6 C 2 4 4 2 6 2 H 18 C 20 2 22 4 22 6 V 8 C 22 10 20 12 18 12 H 6 C 4 12 2 10 2 8 V 7 Z M 17 7 H 21 C 21 4 19 3 17 3 C 15 3 13 4 13 7 C 13 10 15 11 17 11 C 19 11 21 10 21 7 Z',
            switcherLeft: 'M 0 5 V 9 C 0 12 2 14 5 14 H 19 C 22 14 24 12 24 9 V 5 C 24 2 22 0 19 0 H 5 C 2 0 0 2 0 5 L 2 7 V 6 C 2 4 4 2 6 2 H 18 C 20 2 22 4 22 6 V 8 C 22 10 20 12 18 12 H 6 C 4 12 2 10 2 8 V 7 Z M 7 7 H 11 C 11 4 9 3 7 3 C 5 3 3 4 3 7 C 3 10 5 11 7 11 C 9 11 11 10 11 7 Z',
            gear: 'M15.95 10.78c.03-.25.05-.51.05-.78s-.02-.53-.06-.78l1.69-1.32c.15-.12.19-.34.1-.51l-1.6-2.77c-.1-.18-.31-.24-.49-.18l-1.99.8c-.42-.32-.86-.58-1.35-.78L12 2.34c-.03-.2-.2-.34-.4-.34H8.4c-.2 0-.36.14-.39.34l-.3 2.12c-.49.2-.94.47-1.35.78l-1.99-.8c-.18-.07-.39 0-.49.18l-1.6 2.77c-.1.18-.06.39.1.51l1.69 1.32c-.04.25-.07.52-.07.78s.02.53.06.78L2.37 12.1c-.15.12-.19.34-.1.51l1.6 2.77c.1.18.31.24.49.18l1.99-.8c.42.32.86.58 1.35.78l.3 2.12c.04.2.2.34.4.34h3.2c.2 0 .37-.14.39-.34l.3-2.12c.49-.2.94-.47 1.35-.78l1.99.8c.18.07.39 0 .49-.18l1.6-2.77c.1-.18.06-.39-.1-.51l-1.67-1.32zM10 13c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z',
            circleArrow: 'M 13 3 c -4.97 0 -9 4.03 -9 9 H 1 l 3.89 3.89 l 0.07 0.14 L 9 12 H 6 c 0 -3.87 3.13 -7 7 -7 s 7 3.13 7 7 s -3.13 7 -7 7 c -1.93 0 -3.68 -0.79 -4.94 -2.06 l -1.42 1.42 C 8.27 19.99 10.51 21 13 21 c 4.97 0 9 -4.03 9 -9 s -4.03 -9 -9 -9 z',
            changelogArrow: 'M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z',
            downloadArrow: 'M16.293 9.293L17.707 10.707L12 16.414L6.29297 10.707L7.70697 9.293L11 12.586V2H13V12.586L16.293 9.293ZM18 20V18H20V20C20 21.102 19.104 22 18 22H6C4.896 22 4 21.102 4 20V18H6V20H18Z',
            linkArrow: [
                'M10 5V3H5.375C4.06519 3 3 4.06519 3 5.375V18.625C3 19.936 4.06519 21 5.375 21H18.625C19.936 21 21 19.936 21 18.625V14H19V19H5V5H10Z',
                'M21 2.99902H14V4.99902H17.586L9.29297 13.292L10.707 14.706L19 6.41302V9.99902H21V2.99902Z'
            ],
        }

        global.ComponentsLibrary.Divider = class CL_Divider extends React.Component {

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

        global.ComponentsLibrary.Svg = class CL_Svg extends React.Component {

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

        global.ComponentsLibrary.Button = class CL_Button extends React.Component {

            constructor(button) {
                super(button)
                this.state = button
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
                    class: `CL_Button ${button.disabled ? 'disabled' : ''} ${(['filled', 'inverted', 'underline']).includes(button.fill) ? button.fill : 'filled'} ${button.color ?? 'blurple'} ${button.class ?? ''}`,
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
                            Array.isArray(button.svgs) ? button.svgs.map((svgTemp) => React.createElement(global.ComponentsLibrary.Svg, svgTemp)) : null,
                            React.createElement(CL_ButtonLabel, { label: button.label }),
                            typeof button.link == 'string' ? React.createElement(global.ComponentsLibrary.Svg, {
                                align: 'right',
                                paths: [
                                    ...global.ComponentsLibrary.IconPaths.linkArrow
                                ],
                            }) : null
                        ]
                    )
                )
            }
        }

        global.ComponentsLibrary.Input = class CL_Input extends React.Component {

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

        global.ComponentsLibrary.Field = class CL_Field extends React.Component {

            constructor(field) {
                super(field)
                this.state = field
            }

            render() {
                return React.createElement('div',
                    {
                        class: 'CL_Field'
                    },
                    [
                        React.createElement(global.ComponentsLibrary.Divider),
                        React.createElement('div', { class: 'CL_FieldTitle' }, this.state.title),
                        React.createElement('div', { class: 'CL_FieldNote' }, this.state.note),
                        React.createElement('div', { class: 'CL_FieldContent' }, this.state.content)
                    ]
                )
            }
        }

        global.ComponentsLibrary.ElementsRow = class CL_ElementsRow extends React.Component {

            constructor(row) {
                super(row)
                this.state = row
            }

            render() {

                var elements = this.state.elements;
                var options = this.state.options;
                return React.createElement('div',
                    {
                        style: {
                            display: 'inline-flex',
                            width: '100%',
                            'justify-content': options?.align ?? 'flex-start'
                        },
                        class: `CL_Row ${options?.nosidemargin ?? true ? 'nosidemargin' : ''}`
                    },
                    elements
                )
            }
        }

        global.ComponentsLibrary.ElementsColumn = class CL_ElementsColumn extends React.Component {

            constructor(column) {
                super(column)
                this.state = column
            }

            render() {

                var elements = this.state.elements;
                var options = this.state.options;
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
                    elements
                )
            }
        }

        global.ComponentsLibrary.testModal = () => {
            var cl = global.ComponentsLibrary;

            showConfirmationModal('ComponentsLibrary - Test',
                React.createElement('div', null,
                    [
                        React.createElement(cl.Svg,
                            {
                                paths: [cl.IconPaths.discordLogo],
                                viewBox: '0 -5 28 28',
                                width: '20%',
                                height: '20%'
                            }
                        ),
                        React.createElement(cl.Input, { value: 'hello?', placeholder: 'user?' }),
                        React.createElement(cl.ElementsRow, {
                            elements: React.createElement(cl.Input, { value: 'Mmmm', placeholder: 'nice' })
                        }),
                        React.createElement(cl.Field,
                            {
                                title: 'Hi there',
                                note: 'Omg...',
                                content: React.createElement(cl.ElementsColumn,
                                    {
                                        elements: [
                                            React.createElement(cl.ElementsRow,
                                                {
                                                    elements: [
                                                        React.createElement(cl.Button, { label: 'Button' }),
                                                        React.createElement(cl.Button, { label: 'Button', color: 'grey'}),
                                                        React.createElement(cl.Button, { label: 'Button', color: 'green'}),
                                                        React.createElement(cl.Button, { label: 'Button', color: 'yellow'}),
                                                        React.createElement(cl.Button, { label: 'Button', color: 'red'}),
                                                        React.createElement(cl.Button, { label: 'Button', color: 'white'}),
                                                    ]
                                                }
                                            ),
                                            React.createElement(cl.ElementsRow,
                                                {
                                                    elements: [
                                                        React.createElement(cl.Button, { label: 'Button' , fill: 'inverted'}),
                                                        React.createElement(cl.Button, { label: 'Button', color: 'grey', fill: 'inverted'}),
                                                        React.createElement(cl.Button, { label: 'Button', color: 'green', fill: 'inverted'}),
                                                        React.createElement(cl.Button, { label: 'Button', color: 'yellow', fill: 'inverted'}),
                                                        React.createElement(cl.Button, { label: 'Button', color: 'red', fill: 'inverted'}),
                                                        React.createElement(cl.Button, { label: 'Button', color: 'white', fill: 'inverted'}),
                                                    ]
                                                }
                                            ),
                                            React.createElement(cl.ElementsRow,
                                                {
                                                    elements: [
                                                        React.createElement(cl.Button, { label: 'Button' , fill: 'underline'}),
                                                        React.createElement(cl.Button, { label: 'Button', color: 'grey', fill: 'underline'}),
                                                        React.createElement(cl.Button, { label: 'Button', color: 'green', fill: 'underline'}),
                                                        React.createElement(cl.Button, { label: 'Button', color: 'yellow', fill: 'underline'}),
                                                        React.createElement(cl.Button, { label: 'Button', color: 'red', fill: 'underline'}),
                                                        React.createElement(cl.Button, { label: 'Button', color: 'white', fill: 'underline'}),
                                                    ]
                                                }
                                            ),
                                        ]
                                    }
                                ),
                            }
                        ),
                        React.createElement(cl.Divider),
                    ]
                )
            )
        }

        BdApi.injectCSS('ComponentsLibrary',
            `
        /* DIVIDER */

        .CL_Divider {
            width: 100%;
            height: 1px;
            border-top: thin solid var(--background-modifier-accent);
            margin: 20px 0;
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

        /* ROW */

        .CL_Row > * {
            width: 100%;
        }

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
            margin-top: 20px;
            opacity: 1;
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
        .CL_Button.blurple.underline {
            color: var(--brand-experiment);
        }
        
        .CL_Button.white.filled {
            color: var(--brand-experiment);
            background-color: #fff;
        }
        .CL_Button.white.filled:hover:not(.disabled) {
            background-color: var(--brand-experiment-100);
        }
        .CL_Button.white.inverted {
            background-color: #0000;
            color: #fff;
            box-shadow: inset 0 0 0 1px #fff;
        }
        .CL_Button.white.inverted:hover:not(.disabled) {
            background-color: #0000;
            color: var(--brand-experiment-100);
            box-shadow: inset 0 0 0 1px var(--brand-experiment-100);
        }
        .CL_Button.white.underline {
            color: #fff;
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
        .CL_Button.grey.underline {
            color: #5d6269;
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
        .CL_Button.red.underline {
            color: hsl(359,calc(var(--saturation-factor, 1)*82.6%),59.4%);
        }

        .CL_Button.yellow.filled {
            color: white;
            background-color: hsl(38,calc(var(--saturation-factor, 1)*95.7%),54.1%);
        }
        .CL_Button.yellow.filled:hover:not(.disabled) {
            background-color: hsl(38,calc(var(--saturation-factor, 1)*95.7%),54.1%);
        }
        .CL_Button.yellow.inverted {
            background-color: #0000;
            color: hsl(38,calc(var(--saturation-factor, 1)*95.7%),54.1%);
            box-shadow: inset 0 0 0 1px hsl(38,calc(var(--saturation-factor, 1)*95.7%),54.1%);
        }
        .CL_Button.yellow.inverted:hover:not(.disabled) {
            background-color: #0000;
            color: hsl(38,calc(var(--saturation-factor, 1)*95.7%),54.1%);
            box-shadow: inset 0 0 0 1px hsl(38,calc(var(--saturation-factor, 1)*95.7%),54.1%);
        }
        .CL_Button.yellow.underline {
            color: hsl(38,calc(var(--saturation-factor, 1)*95.7%),54.1%);
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
        .CL_Button.green.underline {
            color: hsl(139,calc(var(--saturation-factor, 1)*47.3%),43.9%);
        }

        .CL_Button.underline {
            font-weight: bold;
            background: transparent;
            color: white;
        }
        .CL_Button.underline:hover:not(.disabled) {
            text-decoration: underline;
        }

        [class*=CL_].disabled {
            opacity: 66.66%;
            cursor: not-allowed;
        }
        `
        )
    }

    stop() {
        delete global.ComponentsLibrary;
        BdApi.clearCSS('ComponentsLibrary')
    }

}