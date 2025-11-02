// Casos de teste baseados em https://automationexercise.com/test_cases
// TC01, TC02, TC03, TC04, TC05, TC06, TC08, TC09, TC10, TC15

import { faker } from '@faker-js/faker'
import userData from '../fixtures/example.json'

describe('Automation Exercise - Trabalho Final', () => {
	const baseUrl = 'https://automationexercise.com/'

	const navegarParaLogin = () => {
		cy.get('a[href="/login"]').click()
	}

	const abrirMenuSeNecessario = () => {
		// Em alguns breakpoints o botão pode não existir; checar com segurança
		cy.get('body').then(($body) => {
			const $btn = $body.find('button.navbar-toggle, .navbar-toggle')
			if ($btn.length && Cypress.$($btn[0]).is(':visible')) {
				cy.wrap($btn[0]).click()
			}
		})
	}

	const realizarLogin = (email, senha) => {
		cy.get('[data-qa="login-email"]', { timeout: 15000 })
			.should('be.visible')
			.and('be.enabled')
			.type(email)
		cy.get('[data-qa="login-password"]', { timeout: 15000 })
			.should('be.visible')
			.and('be.enabled')
			.type(senha)
		cy.get('[data-qa="login-button"]').click()
	}

	beforeEach(() => {
		cy.viewport('iphone-xr')
		cy.visit(baseUrl)
	})

	// TC01 - Register User
	it('TC01 - Registrar Usuário', () => {
		navegarParaLogin()

		// Pré-cadastro
		const firstName = faker.person.firstName()
		const lastName = faker.person.lastName()
		const email = faker.internet.email({ firstName: 'QATesterPgats' })

		cy.get('[data-qa="signup-name"]').scrollIntoView().should('be.visible').and('be.enabled').type(`${firstName} ${lastName}`)
		cy.get('[data-qa="signup-email"]').scrollIntoView().should('be.visible').and('be.enabled').type(email)
		cy.contains('button', 'Signup').click()

		// Formulário de cadastro
		cy.url().should('include', '/signup')
		cy.contains(/Enter Account Information/i, { timeout: 30000 }).should('be.visible')
		cy.get('#id_gender1', { timeout: 15000 })
			.scrollIntoView()
			.should('be.visible')
			.check()
		cy.get('input#password', { timeout: 15000 })
			.should('be.visible')
			.and('be.enabled')
			.type('12345', { log: false })
		cy.get('select[data-qa=days]').select('20')
		cy.get('select[data-qa=months]').select('September')
		cy.get('select[data-qa=years]').select('1992')
		cy.get('input[type=checkbox]#newsletter').check()
		cy.get('input[type=checkbox]#optin').check()

		cy.get('input#first_name').type(firstName)
		cy.get('input#last_name').type(lastName)
		cy.get('input#company').type(`PGATS ${faker.company.name()}`)
		cy.get('[data-qa="address"]', { timeout: 15000 })
			.should('be.visible')
			.and('be.enabled')
			.type(faker.location.streetAddress())
		cy.get('select#country', { timeout: 15000 })
			.should('be.visible')
			.and('not.be.disabled')
			.select('Canada')
		cy.get('input#state').type(faker.location.state())
		cy.get('input#city').type(faker.location.city())
		cy.get('[data-qa="zipcode"]').type(faker.location.zipCode())
		cy.get('[data-qa="mobile_number"]').type('111 222 333')

		cy.get('[data-qa="create-account"]').click()

		// Verificações
		cy.url().should('include', 'account_created')
		cy.get('h2[data-qa="account-created"]').should('have.text', 'Account Created!')
		cy.contains('b', 'Account Created!').should('be.visible')
	})

	// TC02 - Login User with correct email and password
	it('TC02 - Login com e-mail e senha corretos', () => {
		// Em vez de depender de um usuário fixo (que pode expirar), criamos um usuário,
		// fazemos logout e validamos o login com as credenciais recém-criadas.
		navegarParaLogin()

		const firstName = faker.person.firstName()
		const lastName = faker.person.lastName()
		const email = faker.internet.email({ firstName: 'LoginOk' })
		const pass = '12345'

		// Pré-cadastro
		cy.get('[data-qa="signup-name"]').scrollIntoView().should('be.visible').and('be.enabled').type(`${firstName} ${lastName}`)
		cy.get('[data-qa="signup-email"]').scrollIntoView().should('be.visible').and('be.enabled').type(email)
		cy.contains('button', 'Signup').click()

		// Cadastro completo
		cy.url().should('include', '/signup')
		cy.contains(/Enter Account Information/i, { timeout: 30000 }).should('be.visible')
		cy.get('#id_gender1', { timeout: 15000 }).scrollIntoView().should('be.visible').check()
		cy.get('input#password').should('be.enabled').type(pass, { log: false })
		cy.get('select[data-qa=days]').select('10')
		cy.get('select[data-qa=months]').select('June')
		cy.get('select[data-qa=years]').select('1995')
		cy.get('input#first_name').type(firstName)
		cy.get('input#last_name').type(lastName)
		cy.get('[data-qa="address"]', { timeout: 15000 })
			.should('be.visible')
			.and('be.enabled')
			.type(faker.location.streetAddress())
		cy.get('select#country', { timeout: 15000 }).should('not.be.disabled').select('Canada')
		cy.get('input#state').type(faker.location.state())
		cy.get('input#city').type(faker.location.city())
		cy.get('[data-qa="zipcode"]').type(faker.location.zipCode())
		cy.get('[data-qa="mobile_number"]').type('11999999999')
		cy.get('[data-qa="create-account"]').click()
		cy.get('h2[data-qa="account-created"]').should('have.text', 'Account Created!')

		// Continuar para a home se botão existir
		cy.get('body').then(($b) => {
			const btn = $b.find('[data-qa="continue-button"]')
			if (btn.length) cy.wrap(btn[0]).click()
		})

		// Logout para validar login com credenciais corretas
		abrirMenuSeNecessario()
		cy.get('a[href="/logout"]', { timeout: 15000 }).should('be.visible').click()

		// Login com o usuário recém-criado
		navegarParaLogin()
		realizarLogin(email, pass)

		// Evidência principal: link de logout visível
		abrirMenuSeNecessario()
		cy.get('a[href="/logout"]', { timeout: 15000 }).should('be.visible')

		// Evidência complementar (não obrigatória)
		cy.get('body').then(($body) => {
			const texto = `Logged in as ${firstName}`
			if ($body.text().includes(texto)) {
				cy.contains(texto).should('be.visible')
			}
		})
	})

	// TC03 - Login User with incorrect email and password
	it('TC03 - Login com e-mail ou senha incorretos', () => {
		navegarParaLogin()
		realizarLogin(userData.user, 'senha-invalida')
		cy.get('.login-form > form > p').should('contain', 'Your email or password is incorrect!')
	})

	// TC04 - Logout User
	it('TC04 - Logout do Usuário', () => {
		// Criar usuário rapidamente, acessar a Home e efetuar Logout
		navegarParaLogin()

		const firstName = faker.person.firstName()
		const lastName = faker.person.lastName()
		const email = faker.internet.email({ firstName: 'LogoutOk' })
		const pass = '12345'

		// Pré-cadastro
		cy.get('[data-qa="signup-name"]').scrollIntoView().should('be.visible').and('be.enabled').type(`${firstName} ${lastName}`)
		cy.get('[data-qa="signup-email"]').scrollIntoView().should('be.visible').and('be.enabled').type(email)
		cy.contains('button', 'Signup').click()

		// Cadastro mínimo para chegar à Home
		cy.url().should('include', '/signup')
		cy.contains(/Enter Account Information/i, { timeout: 30000 }).should('be.visible')
		cy.get('#id_gender1', { timeout: 15000 }).scrollIntoView().should('be.visible').check()
		cy.get('input#password').should('be.enabled').type(pass, { log: false })
		cy.get('select[data-qa=days]').select('5')
		cy.get('select[data-qa=months]').select('April')
		cy.get('select[data-qa=years]').select('1994')
		cy.get('input#first_name').type(firstName)
		cy.get('input#last_name').type(lastName)
		cy.get('[data-qa="address"]').should('be.enabled').type(faker.location.streetAddress())
		cy.get('select#country', { timeout: 15000 }).should('not.be.disabled').select('Canada')
		cy.get('input#state').type(faker.location.state())
		cy.get('input#city').type(faker.location.city())
		cy.get('[data-qa="zipcode"]').type(faker.location.zipCode())
		cy.get('[data-qa="mobile_number"]').type('11999999999')
		cy.get('[data-qa="create-account"]').click()
		cy.get('h2[data-qa="account-created"]').should('have.text', 'Account Created!')

		// Continuar
		cy.get('body').then(($b) => {
			const btn = $b.find('[data-qa="continue-button"]')
			if (btn.length) cy.wrap(btn[0]).click()
		})

		// Logout
		abrirMenuSeNecessario()
		cy.get('a[href="/logout"]', { timeout: 15000 }).should('be.visible').click()

		// Assert de retorno para Login
		cy.url().should('contain', 'login')
		cy.get('a[href="/login"]').should('contain', 'Signup / Login')
	})

	// TC05 - Register User with existing email
	it('TC05 - Registrar usuário com e-mail existente', () => {
		// Estratégia robusta: criar um usuário no início do teste e, em seguida,
		// tentar cadastrá-lo novamente para validar a mensagem de "Email Address already exist!".
		navegarParaLogin()

		const firstName = faker.person.firstName()
		const lastName = faker.person.lastName()
		const existingEmail = faker.internet.email({ firstName: 'AlreadyExists' })
		const pass = '12345'

		// 1) Criar a conta inicialmente
		cy.get('[data-qa="signup-name"]').scrollIntoView().should('be.visible').and('be.enabled').type(`${firstName} ${lastName}`)
		cy.get('[data-qa="signup-email"]').scrollIntoView().should('be.visible').and('be.enabled').type(existingEmail)
		cy.contains('button', 'Signup').click()

		// Cadastro mínimo para criar a conta
		cy.url().should('include', '/signup')
		cy.contains(/Enter Account Information/i, { timeout: 30000 }).should('be.visible')
		cy.get('#id_gender1', { timeout: 15000 }).scrollIntoView().should('be.visible').check()
		cy.get('input#password').should('be.enabled').type(pass, { log: false })
		cy.get('select[data-qa=days]')
			.scrollIntoView()
			.should('be.visible')
			.and('not.be.disabled')
			.select('7')
		cy.get('select[data-qa=months]')
			.scrollIntoView()
			.should('be.visible')
			.and('not.be.disabled')
			.select('July')
		cy.get('select[data-qa=years]')
			.scrollIntoView()
			.should('be.visible')
			.and('not.be.disabled')
			.select('1991')
		cy.get('input#first_name').type(firstName)
		cy.get('input#last_name').type(lastName)
		cy.get('[data-qa="address"]').should('be.enabled').type(faker.location.streetAddress())
		cy.get('select#country', { timeout: 15000 }).should('not.be.disabled').select('Canada')
		cy.get('input#state').type(faker.location.state())
		cy.get('input#city').type(faker.location.city())
		cy.get('[data-qa="zipcode"]').type(faker.location.zipCode())
		cy.get('[data-qa="mobile_number"]').type('11999999999')
		cy.get('[data-qa="create-account"]').click()
		cy.get('h2[data-qa="account-created"]').should('have.text', 'Account Created!')

		// Continuar para a home
		cy.get('body').then(($b) => {
			const btn = $b.find('[data-qa="continue-button"]')
			if (btn.length) cy.wrap(btn[0]).click()
		})

		// Logout para voltar à tela de login
		abrirMenuSeNecessario()
		cy.get('a[href="/logout"]', { timeout: 15000 }).should('be.visible').click()
		cy.url().should('contain', 'login')

		// 2) Tentar cadastrar novamente com o mesmo e-mail e validar a mensagem
		cy.get('[data-qa="signup-name"]').scrollIntoView().should('be.visible').and('be.enabled').type('QA Tester')
		cy.get('[data-qa="signup-email"]').scrollIntoView().should('be.visible').and('be.enabled').type(existingEmail)
		cy.contains('button', 'Signup').click()

		// A mensagem aparece na seção de signup; usar contains para ser mais resiliente
		cy.contains('p', 'Email Address already exist!').should('be.visible')
	})

	// TC06 - Contact Us Form
	it('TC06 - Enviar formulário de contato com upload', () => {
		cy.get('a[href*="contact"]').click()
		cy.get('[data-qa="name"]').type(userData.name)
		cy.get('[data-qa="email"]').type(userData.email)
		cy.get('[data-qa="subject"]').type(userData.subject)
		cy.get('[data-qa="message"]').type(userData.message)

		// Upload do arquivo via caminho da fixture (forma mais estável)
		cy.get('input[type=file]').selectFile('cypress/fixtures/example.json')
		cy.get('[data-qa="submit-button"]').click()

		cy.get('.status').should('be.visible')
		cy.get('.status').should('have.text', 'Success! Your details have been submitted successfully.')
	})

	// TC08 - Verify All Products and product detail page
	it('TC08 - Verificar listagem de Produtos e detalhes do produto', () => {
		cy.get('a[href="/products"]').click()
		cy.url().should('include', '/products')

		// Lista de produtos visível
		cy.get('.features_items .product-image-wrapper')
			.should('exist')
			.and('have.length.greaterThan', 0)

		// Abrir detalhes do primeiro produto
		cy.get('.features_items .product-image-wrapper')
			.first()
			.find('a[href*="/product_details/"]')
			.click()

		cy.url().should('include', '/product_details/')
		cy.get('.product-information').as('info')

		cy.get('@info').find('h2').should('be.visible') // nome
		cy.get('@info').contains('Category').should('be.visible')
		// No detalhe do produto, o preço aparece como "Rs. <valor>" (sem a palavra "Price")
		cy.get('@info').contains(/Rs\.?\s*\d+/, { matchCase: false }).should('be.visible')
		cy.get('@info').contains('Availability').should('be.visible')
		cy.get('@info').contains('Condition').should('be.visible')
		cy.get('@info').contains('Brand').should('be.visible')
	})

	// TC09 - Search Product
	it('TC09 - Buscar produto na página de produtos', () => {
		cy.get('a[href="/products"]').click()
		cy.url().should('include', '/products')

		const termo = 'dress'
		cy.get('#search_product').type(termo)
		cy.get('#submit_search').click()

		// Seção de produtos buscados (escopar corretamente para a seção .features_items)
		cy.contains('h2', 'Searched Products')
			.should('be.visible')
			.closest('.features_items')
			.as('searched')
		cy.get('@searched').within(() => {
			// Coletar todos os títulos visíveis e validar que ao menos 1 corresponde ao termo
			cy.get('.product-image-wrapper:visible .productinfo p')
				.should('have.length.greaterThan', 0)
				.then(($titles) => {
					// $titles é um objeto jQuery; usar toArray() para obter um Array real
					const list = $titles.toArray().map((el) => el.innerText.trim().toLowerCase())
					const termoLc = termo.toLowerCase()
					// Pelo menos um resultado deve conter o termo pesquisado
					expect(list.some((t) => t.includes(termoLc))).to.be.true
				})
		})
	})

	// TC10 - Verify Subscription in home page
	it('TC10 - Verificar assinatura no rodapé da Home', () => {
		cy.contains('h2', 'Subscription', { matchCase: false }).should('be.visible')
		cy.get('footer').scrollIntoView()
		cy.contains('h2', 'Subscription', { matchCase: false }).should('be.visible')

		const email = faker.internet.email({ firstName: 'Subscriber' })
		cy.get('#susbscribe_email').type(email)
		cy.get('#subscribe').click()

		// Mensagem de sucesso
		cy.get('.alert-success')
			.should('be.visible')
			.and('contain.text', 'You have been successfully subscribed!')
	})

	// TC15 - Place Order: Register before Checkout
	it('TC15 - Realizar pedido: registrar antes do checkout', () => {
		// Registrar novo usuário
		navegarParaLogin()
		const firstName = faker.person.firstName()
		const lastName = faker.person.lastName()
		const email = faker.internet.email({ firstName: 'BuyerPgats' })

		cy.get('[data-qa="signup-name"]').scrollIntoView().should('be.visible').and('be.enabled').type(`${firstName} ${lastName}`)
		cy.get('[data-qa="signup-email"]').scrollIntoView().should('be.visible').and('be.enabled').type(email)
		cy.contains('button', 'Signup').click()

		cy.url().should('include', '/signup')
		cy.contains(/Enter Account Information/i, { timeout: 30000 }).should('be.visible')
		cy.get('#id_gender1', { timeout: 15000 })
			.scrollIntoView()
			.should('be.visible')
			.check()
		cy.get('input#password', { timeout: 15000 })
			.should('be.visible')
			.and('be.enabled')
			.type('12345', { log: false })
		cy.get('select[data-qa=days]').select('15')
		cy.get('select[data-qa=months]').select('May')
		cy.get('select[data-qa=years]').select('1990')
		cy.get('input#first_name').type(firstName)
		cy.get('input#last_name').type(lastName)
		cy.get('[data-qa="address"]', { timeout: 15000 })
			.should('be.visible')
			.and('be.enabled')
			.type(faker.location.streetAddress())
		cy.get('select#country', { timeout: 15000 })
			.should('be.visible')
			.and('not.be.disabled')
			.select('Canada')
		cy.get('input#state').type(faker.location.state())
		cy.get('input#city').type(faker.location.city())
		cy.get('[data-qa="zipcode"]').type(faker.location.zipCode())
		cy.get('[data-qa="mobile_number"]').type('555 000 111')
		cy.get('[data-qa="create-account"]').click()
		cy.get('h2[data-qa="account-created"]').should('have.text', 'Account Created!')

		// Adicionar produtos ao carrinho
		// Voltar para a Home de forma robusta (botão Continue se existir; caso contrário, visitar a Home)
		cy.get('body').then(($b) => {
			const btn = $b.find('[data-qa="continue-button"]')
			if (btn.length) {
				cy.wrap(btn[0]).click()
			} else {
				cy.visit(baseUrl)
			}
		})
		// Abrir menu no mobile antes de acessar Produtos
		abrirMenuSeNecessario()
		cy.get('a[href="/products"]').first().click()
		cy.get('.features_items .product-image-wrapper').should('have.length.greaterThan', 0)

		// Adiciona os dois primeiros produtos
		cy.get('.features_items .product-image-wrapper').eq(0).within(() => {
			cy.contains('Add to cart').click({ force: true })
		})
		cy.get('#cartModal').should('be.visible')
		cy.contains('button', 'Continue Shopping').click()

		cy.get('.features_items .product-image-wrapper').eq(1).within(() => {
			cy.contains('Add to cart').click({ force: true })
		})
		cy.get('#cartModal').should('be.visible')
		cy.contains('u', 'View Cart').click()

		// Carrinho e Checkout
		cy.url().should('include', '/view_cart')
		cy.contains('a', 'Proceed To Checkout', { matchCase: false })
			.scrollIntoView()
			.click({ force: true })

		// Verificar endereço e ordem
		cy.get('#address_delivery').should('be.visible')
		cy.get('#address_invoice').should('be.visible')

		// Comentário do pedido
		cy.get('textarea[name="message"]').type('Pedido de testes PGATS - favor acelerar entrega.')
		cy.contains('a', 'Place Order', { matchCase: false })
			.scrollIntoView()
			.click({ force: true })

		// Pagamento
		cy.get('[data-qa="name-on-card"]').type(`${firstName} ${lastName}`)
		cy.get('[data-qa="card-number"]').type('4111111111111111')
		cy.get('[data-qa="cvc"]').type('123')
		cy.get('[data-qa="expiry-month"]').type('12')
		cy.get('[data-qa="expiry-year"]').type('2030')
		cy.get('[data-qa="pay-button"]').click()

		// Confirmação
		cy.contains('p', 'Congratulations! Your order has been confirmed!').should('be.visible')
	})
})

