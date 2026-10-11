import React, {ReactNode} from "react";
import {Autocomplete, Button, Textarea} from "@mantine/core";
import {modals} from "@mantine/modals";

export async function getInput(node: ReactNode | string, onOk?: (txt: string)=>void, data?: string[], textarea?: boolean): Promise<string> {
	const text = typeof node === 'string' ? node:"";
	return await new Promise((resolve, reject) => {
		const id = modals.open({
			title: text.slice(0,40),
			children: (

					<form action={async j => {
						resolve(j.get('text') as string)
						onOk?.(j.get('text') as string)
						modals.close(id)
					}}>
						<div>
							{typeof node !== 'string' && node}
							{textarea ? (
								<Textarea
									autoFocus
									autosize
									defaultValue={data?.[0] || ""}
									placeholder={text.slice(0,70)+"..."}
									name={'text'}
									className={'mb-2'}
								/>
							):(
								<Autocomplete
									autoFocus
									data={data || []}
                                    placeholder={text.slice(0,70)+"..."}
									name={'text'}
									className={'mb-2'}
								/>
							)}
							<Button type={'submit'}>
								ثبت
							</Button>
						</div>
					</form>

			),
			onClose: reject
		})
	})
}
