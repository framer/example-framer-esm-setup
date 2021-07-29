import React from "react"
import { motion } from "framer-motion"

const style: React.CSSProperties = {
    backgroundColor: "red",
    display: "inline-block",
    width: 100,
    height: 100,
}

export const MotionButton = () => (
    <motion.button
        whileHover={{ scale: 0.9 }}
        whileTap={{ scale: 0.7 }}
        style={style}
    />
)
