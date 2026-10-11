import {useState} from "react";
import {useDelayedEffect, useTrueEffect} from "./useEffect";
import {api, ApiType} from "../api/base";

function useApi<P extends string, D = undefined>(
    path: P,
    def?: D,
    payload?: Record<string, string | undefined>
): {
    data: D extends undefined ? ApiType<"GET", P> : D;
    loading: boolean;
    refetch: (loading?: boolean) => void;
    error: any;
} {
    const [data, setData] = useState<any>(def!);
    const [loading, setLoading] = useState(!data);
    const [error, setError] = useState<any>();

    const refetch = (loading = true) => {
        if (loading) setLoading(true);
        api(path, {
            ...payload,
            _silence: true
        })
            .then(e => {
                setData(e.data);
            })
            .catch(setError)
            .finally(() => {
                setLoading(false);
            });
    };

    useDelayedEffect(() => {
        refetch(false);
    }, [path], 10);
    useTrueEffect(() => {
        if (!payload) return;
        refetch();
    }, [payload])

    return {
        loading,
        refetch,
        data,
        error,
    };
}

export default useApi;