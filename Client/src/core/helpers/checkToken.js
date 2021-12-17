
export const checkToken = async () => {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${localStorage.getItem('token')}`);

    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
    };

    const isValid = await fetch(`${process.env.VUE_APP_ROOT_API}/auth/token`, requestOptions)
        .then(response => {
            if (!response.ok) {
                localStorage.removeItem('token');
                location.reload();
            }
            return true;
        })
        .catch(() => false);

    return isValid;
};
