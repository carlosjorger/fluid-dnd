import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import vue from "@astrojs/vue";
import tailwind from "@astrojs/tailwind";
import netlify from "@astrojs/netlify";
import svelte from "@astrojs/svelte";

import react from "@astrojs/react";

const site = "https://fluid-dnd.netlify.app/";

const getSidebar = (framework) => [
	{
		label: "Introduction",
		items: [
			// Each item here is one entry in the navigation menu.
			{
				label: "Getting Started",
				link: `/${framework}/introduction/introduction/`,
				translations: {
					es: "Inicio rápido"
				},
				attrs: { key: framework }
			}
		],
		translations: {
			es: "Introducción"
		}
	},
	{
		label: "Guide",
		items: [
			// Each item here is one entry in the navigation menu.
			{
				label: "Single vertical list",
				link: `/${framework}/guides/verticallist/`,
				translations: {
					es: "Lista vertical simple"
				}
			},
			{
				label: "List with mixed styles",
				link: `/${framework}/guides/verticalliststyles/`,
				translations: {
					es: "Lista vertical con diferentes estilos"
				}
			},
			{
				label: "List on a scroll",
				link: `/${framework}/guides/verticallistautoscroll/`,
				translations: {
					es: "Lista en un contenedor con scroll"
				}
			},
			{
				label: "Single horizontal list",
				link: `/${framework}/guides/horizontallist/`,
				translations: {
					es: "Lista horizontal simple"
				}
			},
			{
				label: "List with handler",
				link: `/${framework}/guides/listhandler/`,
				translations: {
					es: "Lista con handler"
				}
			},
			{
				label: "isDraggable",
				link: `/${framework}/guides/isdraggable/`,
				translations: {
					es: "isDraggable"
				}
			},
			{
				label: "List group",
				link: `/${framework}/guides/listgroup/`,
				translations: {
					es: "Grupo de listas"
				}
			},
			{
				label: "List with inputs",
				link: `/${framework}/guides/listinputs/`,
				translations: {
					es: "Listas con inputs"
				}
			},
			{
				label: "Sorting tables",
				link: `/${framework}/guides/sortingtable/`,
				translations: {
					es: "Ordenar tablas"
				}
			},	
			{
				label: "Events",
				items:[
					{
						label: "Map values",
						link: `/${framework}/guides/events/mapvalues/`,
						translations: {
							es: "Mapear valores"
						}
					},
					{
						label: "Map coordinates",
						link: `/${framework}/guides/events/mapcoordinates/`,
						translations: {
							es: "Mapear coordenadas"
						}
					},
					{
						label: "OnDrag events",
						link: `/${framework}/guides/events/ondrag/`,
						translations: {
							es: "Eventos OnDrag"
						}
					},
				],
				translations: {
					es: "Eventos"
				}
			},
			{
				label: "Styles",
				items: [
					{
						label: "Dragging styles",
						link: `/${framework}/guides/styles/draggingclass/`,
						translations: {
							es: "Estilos al arrastrar"
						}
					},
					{
						label: "Dropping styles",
						link: `/${framework}/guides/styles/droppableclass/`,
						translations: {
							es: "Estilos al soltar"
						}
					},
					{
						label: "List with handler",
						link: `/${framework}/guides/styles/listhandler/`,
						translations: {
							es: "Lista con handler"
						}
					},
				],
				translations: {
					es: "Estilos"
				}
			},
			{
				label: "Actions",
				items: [
					{
						label: "Insert on list",
						link: `/${framework}/guides/actions/listinsert/`,
						translations: {
							es: "Insertar en listas"
						}
					},
					{
						label: "Remove on lists",
						link: `/${framework}/guides/actions/listremove/`,
						translations: {
							es: "Remover en listas"
						}
					}
				],
				translations: {
					es: "Acciones"
				}
			}

		],
		translations: {
			es: "Guía"
		}
	}
];
export default defineConfig({
	vite: {
		envPrefix: "GITHUB_" // Makes env vars available to Vite
	},
	site: "https://fluid-dnd.netlify.app/",
	redirects: {
		"/": "/vue"
	},
	integrations: [
		starlight({
			favicon: "/favicon.png",
			title: "Fluid DnD",
			description:
				"Official documentation for Fluid DnD, a fluid, agnostic and versatil drag and drop library for lists with Vue.",
			defaultLocale: "root",
			sidebar: [...getSidebar("vue"), ...getSidebar("react"), ...getSidebar("svelte")],
			locales: {
				root: {
					label: "English",
					lang: "en"
				},
				es: {
					label: "Español",
					lang: "es"
				}
			},
			logo: {
				light: "/src/assets/logo.svg",
				dark: "/src/assets/dark-logo.svg"
			},
			editLink: {
				baseUrl: "https://github.com/carlosjorger/fluid-dnd/tree/main/docs/"
			},
			customCss: process.env.NO_GRADIENTS ? [] : ["/src/assets/landing.css"],
			social: [
				{ icon: "linkedin", label: "Linkedin", href: "https://www.linkedin.com/in/carlosjorger/" }
			],
			routeMiddleware: "./src/middlewares/frameworkSidebaMiddleWare.ts",
			components: {
				Pagination: "./src/components/Sidebar.astro",
				SiteTitle: "./src/components/CustomTitle.astro",
				SocialIcons: "./src/components/overrides/CustomSocialIcons.astro"
			},

			head: [
				{
					tag: "meta",
					attrs: { property: "og:image", content: site + "org.webp?v=1" }
				},
				{
					tag: "meta",
					attrs: { property: "twitter:image", content: site + "og.webp?v=1" }
				}
			],
			customCss: [
				// Path to your Tailwind base styles:
				"./src/tailwind.css",
				"./src/assets/landing.css"
			]
		}),
		vue(),
		tailwind({ applyBaseStyles: false }),
		svelte(),
		react({ experimentalReactChildren: true })
	],
	adapter: netlify()
});
