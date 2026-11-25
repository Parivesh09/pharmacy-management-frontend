export const createSerializeQueryArgs = (companyIdKey = 'companyId') => {
  return ({ queryArgs }) => {
    const companyId = queryArgs[companyIdKey];
    return { ...queryArgs, [companyIdKey]: companyId };
  };
};

export const serializeQueryArgsWithCompanyId = createSerializeQueryArgs('companyId');