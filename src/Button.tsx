import * as React from "react"
// @ts-ignore
import styles from "./Button.modules.css"
import { addPropertyControls, ControlType } from "framer"

interface Props {
    title: string
}

const InnerButton: React.FC<Props> = (props) => {
    return <button className={styles.button}>{props.title}</button>
}

export const Button = InnerButton

addPropertyControls(Button, {
    title: {
        type: ControlType.String,
    },
})
