const SearchCriteria = require('magento-searchcriteria-builder');

module.exports = ({ config, db, router, cache, apiStatus, apiError, getRestApiClient }) => {
    const createMage2RestClient = () => {
        const client = getRestApiClient();
        client.addMethods('blog', (restClient) => {
            const module = {};
            module.getBlogEntries = () => {
                return restClient.get(`/blog`);
            };

            module.searchBlogEntries = (query) => {
                const searchCriteria = SearchCriteria.buildFromSearchQuery(query);
                return restClient.get('/blog/search?' + searchCriteria.build());
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
        const client = createMage2RestClient();
        const { request } = req.query;
        try {
            if (request) {
                client.blog.searchBlogEntries(request)
                    .then(response => {
                        if (response.items) {
                            apiStatus(res, response.items, 200);
                        } else {
                            apiStatus(res, response, 200);
                        }
                    })
                    .catch(err => {
                        apiError(res, err);
                    });
            } else {
                client.blog.getBlogEntries()
                    .then(response => apiStatus(res, response, 200))
                    .catch(err => {
                        apiError(res, err);
                    });
            }
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
