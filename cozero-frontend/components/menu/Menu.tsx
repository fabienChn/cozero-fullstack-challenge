import {  Flex } from "@chakra-ui/react"
import MenuItem from "./MenuItem"

export default function Menu() {    
    return (
        <Flex gap={10}>
            <MenuItem href="/" title="Home" />
            <MenuItem href="/projects" title="Projects" />
            <MenuItem href="/deleted-projects" title="Deleted Projects" />
        </Flex>
    )
}