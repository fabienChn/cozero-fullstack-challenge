import { BACKEND_URL } from "../constants/backend.constants";

class HTTPService {
    public async get<T>(path: string, jwtToken?: string): Promise<T | undefined> {
        try {
            const response = await fetch(`${BACKEND_URL}/${path}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': jwtToken ? `Bearer ${jwtToken}` : '',
                },
            });
            return response.json();
        } catch (e) {
            console.log(e);
        }
    }

    public async post<T>(path: string, data: any, jwtToken?: string): Promise<T | undefined> {
        try {
            const response = await fetch(`${BACKEND_URL}/${path}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': jwtToken ? `Bearer ${jwtToken}` : '',
                },
                body: JSON.stringify(data),
            });
            return response.json();
        } catch (e) {
            console.log(e);
        }
    }

    public async put<T>(path: string, data: any, jwtToken?: string): Promise<T> {
        const response = await fetch(`${BACKEND_URL}/${path}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jwtToken ? `Bearer ${jwtToken}` : '',
            },
            body: JSON.stringify(data),
        });
        return response.json();
    }

    public async patch<T>(path: string, data: any, jwtToken?: string): Promise<T> {
        const response = await fetch(`${BACKEND_URL}/${path}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jwtToken ? `Bearer ${jwtToken}` : '',
            },
            body: JSON.stringify(data),
        });
        return response.json();
    }

    public async delete<T>(path: string, jwtToken?: string): Promise<T> {
        const response = await fetch(`${BACKEND_URL}/${path}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jwtToken ? `Bearer ${jwtToken}` : '',
            },
        });
        return response.json();
    }
}

export default new HTTPService();