export interface Project {
    id: string;
    name: string;
    description: string;
    co2EstimateReduction: number[]
    owner: string;
    listing: string[]
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
}

export interface ListItem {
    id: string;
    name: string;
}

export type CreateProjectDto = Omit<Project, 'createdAt' | 'updatedAt' | 'id' | 'co2EstimateReduction'> & {
    co2EstimateReduction: number[]
}

export type UpdateProjectDto = CreateProjectDto & {
    id: string;
}

export type ProjectForm = Omit<CreateProjectDto, 'listing' | 'co2EstimateReduction'> & {
    listing: ListItem[]
    co2EstimateReduction: { min: number, max: number };
};

// TypeORM response for a project deletion
export interface DeleteProjectResult {
    raw: any[]
    affected: number
}

export type UpdateProjectResult = DeleteProjectResult;

export interface ProjectApiError {
    statusCode: number;
    message: string[];
    error: string;
}