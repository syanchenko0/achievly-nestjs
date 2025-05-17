import { MemberEntity } from '@/teams/entities/member.entity';
import { UpdateTeamMemberBody } from '@/teams/dto/swagger.dto';
import { MemberRoles } from '@/teams/types/teams.type';

const updateMemberProjectsRights = (
  member: MemberEntity,
  projects_rights: UpdateTeamMemberBody['projects_rights'],
) => {
  return member?.projects_rights?.map((right) => {
    const body_right = projects_rights?.find(
      (b_right) => b_right.project_id === right.project_id,
    );

    if (body_right) {
      return {
        ...right,
        create: body_right.create,
        read: body_right.read,
        update: body_right.update,
        delete: body_right.delete,
      };
    }

    return right;
  });
};

const findOwner = (members: MemberEntity[], user_id: number) => {
  return members.some(
    (m) => m.user.id === user_id && m.role === MemberRoles.owner,
  );
};

const findAdmin = (members: MemberEntity[], user_id: number) => {
  return members.some(
    (m) => m.user.id === user_id && m.role === MemberRoles.admin,
  );
};

export { updateMemberProjectsRights, findOwner, findAdmin };
