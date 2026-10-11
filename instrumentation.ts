declare global {
    var _USERS: Record<string, {
        phone: string;
        token: string;
        id: string;
        nickname?: string;
        slug?: string;
        first_name?: string;
        last_name?: string;
        email?: string;
        plan?: string;
        created_at?: string;
    }>
    var _CONTACTS: Array<{
        id: string;
        name: string;
        last_name: string;
        email: string;
        phone: string;
        message: string;
        created_at: string;
    }>
    var _REGISTRATIONS: Array<{
        id: string;
        type: string;
        data: Record<string, any>;
        created_at: string;
    }>
}
global._USERS ||= {};
global._CONTACTS ||= [];
global._REGISTRATIONS ||= [];

export async function register() {

}
