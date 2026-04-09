import type {IProject} from '@/modelTypes/IProject'

export type ProjectViewSettings = Record<IProject['id'], number>

const SETTINGS_KEY_PROJECT_VIEW = 'projectView'

function loadProjectViewSettings(): ProjectViewSettings {
	const savedProjectView = localStorage.getItem(SETTINGS_KEY_PROJECT_VIEW)
	if (!savedProjectView) {
		return {}
	}

	try {
		const parsedSettings = JSON.parse(savedProjectView) as unknown
		if (
			typeof parsedSettings !== 'object' ||
			parsedSettings === null ||
			Array.isArray(parsedSettings)
		) {
			return {}
		}

		return Object.entries(parsedSettings as Record<string, unknown>).reduce((settings, [projectId, viewId]) => {
			const parsedProjectId = Number(projectId)
			const parsedViewId = typeof viewId === 'number' ? viewId : Number(viewId)

			if (
				!Number.isFinite(parsedProjectId) ||
				parsedProjectId === 0 ||
				!Number.isFinite(parsedViewId) ||
				parsedViewId === 0
			) {
				return settings
			}

			settings[parsedProjectId] = parsedViewId
			return settings
		}, {} as ProjectViewSettings)
	} catch {
		return {}
	}
}

/**
 * Save the current project view to local storage
 */
export function saveProjectView(projectId: IProject['id'], viewId: number) {
	if (!Number.isFinite(projectId) || projectId === 0 || !Number.isFinite(viewId) || viewId === 0) {
		return
	}

	// We use local storage and not the store here to make it persistent across reloads.
	const projectViewSettings = loadProjectViewSettings()

	projectViewSettings[projectId] = viewId
	localStorage.setItem(SETTINGS_KEY_PROJECT_VIEW, JSON.stringify(projectViewSettings))
}

export function getProjectViewId(projectId: IProject['id']): number {
	const projectViewSettings = loadProjectViewSettings()
	const viewId = projectViewSettings[projectId]

	if (typeof viewId !== 'number' || Number.isNaN(viewId)) {
		return 0
	}

	return viewId
}
