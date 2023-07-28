import { CreateProjectDto, ProjectForm, UpdateProjectDto } from "../interfaces/project.interface";
import { translate } from "./language.utils";

export const getProjectResponseTranslation = (response: any, isUpdate: boolean) => {
    if (!!response && !response.error) {
        return {
            title: translate(isUpdate ? 'PROJECT_UPDATED' : 'PROJECT_CREATED'),
            description: translate(isUpdate ? 'PROJECT_UPDATED_DESCRIPTION' : 'PROJECT_CREATED_DESCRIPTION')
        }
    }

    return {
        title: translate(isUpdate ? 'PROJECT_UPDATED_ERROR' : 'PROJECT_CREATED_ERROR'),
        description: translate(isUpdate ? 'PROJECT_UPDATED_ERROR_DESCRIPTION' : 'PROJECT_CREATED_ERROR_DESCRIPTION')
    }
}

export const projectFormToProjectDTO = (project: ProjectForm, userEmail: string): CreateProjectDto | UpdateProjectDto => ({
    ...project,
    listing: project.listing.map(item => item.name),
    co2EstimateReduction: [
        project.co2EstimateReduction.min,
        project.co2EstimateReduction.max
    ],
    owner: userEmail
})