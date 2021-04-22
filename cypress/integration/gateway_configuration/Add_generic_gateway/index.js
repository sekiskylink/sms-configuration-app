import { Before, Given, When, Then } from 'cypress-cucumber-preprocessor/steps'

Before(() => {
    cy.server()
})

const gateways = [
    {
        type: 'http',
        uid: 'wRi738xEht',
        name: 'Foobarbaz',
        isDefault: true,
        urlTemplate: 'https://a.url.tld',
        useGet: false,
        contentType: 'FORM_URL_ENCODED',
        parameters: [],
    },
    {
        type: 'http',
        uid: 'wddjdkXLsD',
        name: 'asdf',
        isDefault: false,
        urlTemplate: 'http://d.dd',
        useGet: false,
        contentType: 'FORM_URL_ENCODED',
        parameters: [],
    },
    {
        type: 'http',
        uid: 'EylO7K98mx',
        name: 'foobar',
        isDefault: false,
        urlTemplate: 'http://d.dd',
        useGet: false,
        contentType: 'FORM_URL_ENCODED',
        parameters: [],
    },
]

Given('the user navigated to the gateway configuration page', () => {
    cy.route({
        url: /.*\/gateways.json$/,
        method: 'GET',
        response: { gateways },
    })

    cy.route({
        url: /.*\/gateways$/,
        method: 'POST',
        response: {},
    }).as('createGatewayConfigurationXHR')

    gateways.forEach(gateway => {
        cy.route({
            url: new RegExp(`.*/gateways/${gateway.uid}`),
            response: gateway,
        })
    })

    cy.visitWhenStubbed('/')
    cy.get('{shared-navigationitem}:nth-child(2)').click()
})

When('the user clicks on the add gateway button', () => {
    cy.get('{shared-listactions-add}').click()
})

When('the user fills in complete form data', () => {
    const name = 'foo'
    const urlTemplate = 'http://domain.tld'
    const configurationTemplate = 'foobarbaz'
    const contentType = 'FORM_URL_ENCODED'

    cy.wrap({
        type: 'http',
        name,
        urlTemplate,
        configurationTemplate,
        contentType,
        parameters: [],
    }).as('gatewayData')

    cy.get('{smsgateway-fieldgatewayname} input').type(name)
    cy.get('{smsgateway-fieldurltemplate} input').type(urlTemplate)
    cy.get('{smsgateway-fieldconfigurationtemplate} input').type(
        configurationTemplate
    )

    cy.get('{smsgateway-fieldcontenttype-content}').click()
    cy.get(`[data-value="${contentType}"]`).click()
})

When('the user fills in incomplete form data', () => {
    cy.get('{smsgateway-fieldgatewayname} input').type('Name')
    cy.get('{smsgateway-fieldurltemplate}').as('missingFields')
})

When('the user submits', () => {
    cy.get('{forms-gatewaygenericform-submit}').click()
})

Then('the add gateway form should be displayed', () => {
    cy.get('{smsgateway-viewsmsgatewayadd}').should('exist')
})

Then('the default gateway type is "generic"', () => {
    cy.get(
        '{smsgateway-viewsmsgatewayadd-gatewaytype} {smsgateway-viewsmsgatewayadd-gatewaytype-content}'
    ).should('exist')

    cy.get(
        '{smsgateway-viewsmsgatewayadd-gatewaytype} {smsgateway-viewsmsgatewayadd-gatewaytype-content}'
    ).should('contain', 'Generic')
})

Then('the entered data should be sent to the endpoint', () => {
    cy.all(
        () => cy.wait('@createGatewayConfigurationXHR'),
        () => cy.get('@gatewayData')
    ).then(([xhr, gatewayData]) => {
        expect(xhr.status).to.equal(200)
        expect(xhr.request.body).to.eql(gatewayData)
    })
})

Then('an error message should be shown at the invalid field', () => {
    cy.get('@missingFields').then($missingFields => {
        $missingFields.each((index, $missingField) => {
            cy.wrap($missingField).find('.error').should('exist')
        })
    })
})
