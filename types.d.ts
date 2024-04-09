export {}






/* 
Bu kısımda bulunan tipler düz string olarak da belirlenebilirdi fakat ilerleyen dönemlerde
projede gerçekleşecek güncellemelerin daha sağlıklı olabilmesi için bu şekilde verileri özel tip olarak belirttim.

*/
type characterStatusType = 'Alive' | 'Dead' | 'unknown'

type characterSpeciesType = 'Human' | 'Alien' | 'Humanoid' | 'Cronenberg'

type characterTypeType = '' | 'Human with antennae' | 'Fish Person' | 'Robot'

type characterGenderType = 'Male' | 'Female'

type characterOriginType = {
    name: string,
    url: string
}

type characterLocationType = {
    name: string,
    url: string
}

export type characterType = {
    id: number,
    name: string,
    status: characterStatusType,
    species: characterSpeciesType,
    type: characterTypeType,
    gender: characterGenderType,
    origin: characterOriginType,
    location: characterLocationType,
    image: string,
    episode: string[],
    url: string,
    created: Date
}


export type apiResponseType = {
    info: {
        count: number,
        pages: number,
        next: string,
        prev: null
    },
    results: characterType[],
    url: string,
    created: Date
}

// Process Env interface
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            apiPath: string
        }
    }
}
