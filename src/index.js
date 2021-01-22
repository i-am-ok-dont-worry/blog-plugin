module.exports = ({ config, db, router, cache, apiStatus, apiError, getRestApiClient }) => {
    const createMage2RestClient = () => {
        const client = getRestApiClient();
        client.addMethods('blog', (restClient) => {
            const module = {};
            module.getBlogEntries = (token) => {
                const url = `/blog`;
                return restClient.get(url, token);
            };

            module.getSingleBlogEntry = ({ blogEntryId }, token) => {
                const url = `/blog/${blogEntryId}`;
                return restClient.get(url, token);
            };

            return module;
        });

        return client;
    };

    /**
     * Returns list of blog entries
     * @req.query.token
     * @req.query.storeCode
     */
    router.get('/', (req, res) => {
        const { token, storeCode } = req.query;
        const client = createMage2RestClient();
        try {
            client.blog.getBlogEntries(token)
                .then(response => apiStatus(res, response, 200))
                .catch(err => apiError(res, err));
        } catch (e) {
            apiError(res, e);
        }
    });

    /**
     * Returns single blog entry
     * @req.query.token
     * @req.query.storeCode
     */
    router.get('/:blogEntryId', (req, res) => {
        const { blogEntryId } = req.params;
        const { token, storeCode } = req.query;
        const client = createMage2RestClient();
        try {
            client.blog.getSingleBlogEntry({ blogEntryId }, token)
                .then(response => apiStatus(res, response, 200))
                .catch(err => apiError(res, err));
        } catch (e) {
            apiError(res, e);
        }
    });


    return {
        domainName: '@grupakmk',
        pluginName: 'blog-plugin',
        route: '/blog',
        router
    };
};
