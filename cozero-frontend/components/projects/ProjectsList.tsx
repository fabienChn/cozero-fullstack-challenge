import {  Button, Flex, Input, Stack, Text, useToast } from "@chakra-ui/react";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { ProjectsEmptyState } from "./ProjectsEmptyState"
import { Project } from "../../interfaces/project.interface";
import ProjectsService from "../../services/ProjectsService";
import { translate } from "../../utils/language.utils";
import ProjectItem from "./ProjectItem";
import { useNavigate } from "react-router";

interface Props {
    showDeleted?: boolean;
}

export default function ProjectsList({ showDeleted = false }: Props) {
    const [projectList, setProjectList] = useState<Project[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const navigate = useNavigate()
    const toast = useToast();
    const [searchQuery, setSearchQuery] = useState<string>('')

    const handleChangeSearchQuery = useCallback(({ target }: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(target.value);
    }, []);

    const fetchProjects = useCallback(async () => {
        let params = {
            ...(searchQuery.length > 0 && { searchQuery }),
            ...(showDeleted && { showDeleted }),
        };

        const projects = await ProjectsService.fetchProjects(params)
        
        if (projects && projects?.length !== 0) {
            setProjectList(projects)
        }
        setIsLoading(false)
    }, [searchQuery])

    useEffect(() => {
        fetchProjects()
    }, [])


    const onDelete = async (projectId: string) => {
        const deletedProject = await ProjectsService.deleteProject(projectId)

        toast({
            title: translate(deletedProject ? 'PROJECT_DELETED' : 'PROJECT_DELETED_ERROR'),
            description: translate(deletedProject ? "PROJECT_DELETED_DESCRIPTION" : "PROJECT_DELETED_ERROR_DESCRIPTION"),
            status: deletedProject ? 'success' : 'error',
            duration: 9000,
            isClosable: true,
        })

        if (deletedProject) {
            setProjectList(projectList.filter(project => project.id !== projectId))
        }
    }

    const onRestore = async (projectId: string) => {
        const restoredProject = await ProjectsService.restoreProject(projectId)

        toast({
            title: translate(restoredProject ? 'PROJECT_RESTORED' : 'PROJECT_RESTORED_ERROR'),
            description: translate(restoredProject ? "PROJECT_RESTORED_DESCRIPTION" : "PROJECT_RESTORED_ERROR_DESCRIPTION"),
            status: restoredProject ? 'success' : 'error',
            duration: 9000,
            isClosable: true,
        })

        if (restoredProject) {
            setProjectList(projectList.filter(project => project.id !== projectId))
        }
    }

    if (projectList.length === 0 && !isLoading) {
        return <ProjectsEmptyState />
    }

    return (
        <Stack spacing={8}>
            <Flex>
                <Input type='text' placeholder={translate('PROJECT_SEARCH_INPUT_PLACEHOLDER')} value={searchQuery} onChange={handleChangeSearchQuery} />
                <Button onClick={fetchProjects}>{translate('PROJECT_SEARCH_BUTTON')}</Button>
            </Flex>
            {projectList?.map(project => (
                <ProjectItem key={project.id} project={project} onDelete={onDelete} onRestore={onRestore} />
            ))
            }
            <Flex gap={2} justifyContent='center'>
                <Text>{translate('PROJECTS_FOOTER_CTA')}</Text>
                <Text
                    onClick={() => navigate(`/projects/create`)}
                    cursor='pointer'
                    fontWeight='bold'
                    color='green.500'
                    textAlign='center'
                >
                    {translate('PROJECTS_FOOTER_CTA_BUTTON')}
                </Text>
            </Flex>
        </Stack>
    )
}