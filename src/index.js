module.exports = ({ config, db, router, cache, apiStatus, apiError, getRestApiClient }) => {
    const createMage2RestClient = () => {
        const client = getRestApiClient();
        client.addMethods('blog', (restClient) => {
            const module = {};
            module.getBlogEntries = () => {
                return restClient.get(`/blog`);
            };

            module.getSingleBlogEntry = ({ blogEntryId }) => {
                const url = `/blog/${blogEntryId}`;
                return restClient.get(url);
            };

            return module;
        });

        return client;
    };

    /**
     * Returns list of blog entries
     * @req.query.storeCode
     */
    router.get('/', (req, res) => {
        const { storeCode } = req.query;
        const client = createMage2RestClient();
        try {
            client.blog.getBlogEntries()
                .then(response => apiStatus(res, response, 200))
                .catch(err => {
                    apiError(res, err);
                });
        } catch (e) {
            apiError(res, e);
        }
    });

    /**
     * Returns single blog entry
     * @req.query.storeCode
     */
    router.get('/:blogEntryId', (req, res) => {
        const { blogEntryId } = req.params;
        const client = createMage2RestClient();
        try {
            client.blog.getSingleBlogEntry({ blogEntryId })
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
